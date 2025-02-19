import socket from "../socket";
import eventbus from "../eventbus";
import type {ClientChan, ClientNetwork, ClientUser} from "../types";
import {switchToChannel} from "../router";
import {TypedStore} from "../store";
import useCloseChannel from "../hooks/use-close-channel";
import {ChanType} from "../../../shared/types/chan";

type BaseContextMenuItem = {
	label: string;
	type: string;
	class: string;
};

type ContextMenuItemWithAction = BaseContextMenuItem & {
	action: () => void;
};

type ContextMenuItemWithLink = BaseContextMenuItem & {
	link?: string;
};

type ContextMenuDividerItem = {
	type: "divider";
};

export type ContextMenuItem =
	| ContextMenuItemWithAction
	| ContextMenuItemWithLink
	| ContextMenuDividerItem;

export function generateChannelContextMenu(
	channel: ClientChan,
	network: ClientNetwork
): ContextMenuItem[] {
	const closeChannel = useCloseChannel(channel);

	const typeMap = {
		lobby: "network",
		channel: "chan",
		query: "query",
		special: "chan",
	};

	const closeMap = {
		lobby: "Remove",
		channel: "Leave",
		query: "Close",
		special: "Close",
	};

	let items: ContextMenuItem[] = [
		{
			label: channel.name,
			type: "item",
			class: typeMap[channel.type],
			link: `/chan-${channel.id}`,
		},
		{
			type: "divider",
		},
	];

	// Add menu items for lobbies
	if (channel.type === ChanType.LOBBY) {
		items = [
			...items,
			{
				label: "Modifier ce réseau",
				type: "item",
				class: "edit",
				link: `/edit-network/${network.uuid}`,
			},
			{
				label: "Rejoindre un canal…",
				type: "item",
				class: "join",
				action: () => (network.isJoinChannelShown = true),
			},
			{
				label: "Liste des canaux",
				type: "item",
				class: "list",
				action: () =>
					socket.emit("input", {
						target: channel.id,
						text: "/list",
					}),
			},
			{
				label: "Liste des utilisateurs bloqués",
				type: "item",
				class: "list",
				action: () =>
					socket.emit("input", {
						target: channel.id,
						text: "/ignorelist",
					}),
			},
			network.status.connected
				? {
						label: "Déconnexion",
						type: "item",
						class: "disconnect",
						action: () =>
							socket.emit("input", {
								target: channel.id,
								text: "/disconnect",
							}),
				  }
				: {
						label: "Connexion",
						type: "item",
						class: "connect",
						action: () =>
							socket.emit("input", {
								target: channel.id,
								text: "/connect",
							}),
				  },
		];
	}

	// Add menu items for channels
	if (channel.type === ChanType.CHANNEL) {
		items.push({
			label: "Modifier le sujet",
			type: "item",
			class: "edit",
			action() {
				channel.editTopic = true;
				switchToChannel(channel);
			},
		});
		items.push({
			label: "Liste des bannis",
			type: "item",
			class: "list",
			action() {
				socket.emit("input", {
					target: channel.id,
					text: "/banlist",
				});
			},
		});
	}

	// Add menu items for queries
	if (channel.type === ChanType.QUERY) {
		items.push(
			{
				label: "Information sur l'utilisateur",
				type: "item",
				class: "action-whois",
				action() {
					switchToChannel(channel);
					socket.emit("input", {
						target: channel.id,
						text: "/whois " + channel.name,
					});
				},
			},
			{
				label: "Bloquer",
				type: "item",
				class: "action-ignore",
				action() {
					socket.emit("input", {
						target: channel.id,
						text: "/ignore " + channel.name,
					});
				},
			}
		);
	}

	if (channel.type === ChanType.CHANNEL || channel.type === ChanType.QUERY) {
		items.push({
			label: "Effacer l'historique",
			type: "item",
			class: "clear-history",
			action() {
				eventbus.emit(
					"confirm-dialog",
					{
						title: "Effacer l'historique",
						text: `Êtes vous certain de vouloir effacer votre historique sur ${channel.name}? Cette action est irréversible.`,
						button: "Effacer",
					},
					(result) => {
						if (!result) {
							return;
						}

						socket.emit("history:clear", {
							target: channel.id,
						});
					}
				);
			},
		});
	}

	const humanFriendlyChanTypeMap: Record<string, string> = {
		lobby: "network",
		channel: "channel",
		query: "conversation",
	};

	// We don't allow the muting of ChanType.SPECIAL channels
	const mutableChanTypes = Object.keys(humanFriendlyChanTypeMap);

	if (mutableChanTypes.includes(channel.type)) {
		const chanType = humanFriendlyChanTypeMap[channel.type];

		items.push({
			label: channel.muted ? `Unmute ${chanType}` : `Mute ${chanType}`,
			type: "item",
			class: "mute",
			action() {
				socket.emit("mute:change", {
					target: channel.id,
					setMutedTo: !channel.muted,
				});
			},
		});
	}

	// Add close menu item
	items.push({
		label: closeMap[channel.type],
		type: "item",
		class: "close",
		action() {
			closeChannel();
		},
	});

	return items;
}

export function generateInlineChannelContextMenu(
	store: TypedStore,
	chan: string,
	network: ClientNetwork
): ContextMenuItem[] {
	const join = () => {
		const channel = network.channels.find((c) => c.name === chan);

		if (channel) {
			switchToChannel(channel);
		}

		if (store.state.activeChannel) {
			socket.emit("input", {
				target: store.state.activeChannel.channel.id,
				text: "/join " + chan,
			});
		} else {
			// eslint-disable-next-line no-console
			console.error("Unable to join channel: activeChannel is undefined");
		}
	};

	const channel = network.channels.find((c) => c.name === chan);

	if (channel) {
		return [
			{
				label: "Rejoindre le canal",
				type: "item",
				class: "chan",
				link: `/chan-${channel.id}`,
			},
		];
	}

	return [
		{
			label: "Rejoindre le canal",
			type: "item",
			class: "join",
			action: join,
		},
	];
}

export function generateUserContextMenu(
	store: TypedStore,
	channel: ClientChan,
	network: ClientNetwork,
	user: Pick<ClientUser, "nick" | "modes">
): ContextMenuItem[] {
	const currentChannelUser: ClientUser | Record<string, never> = channel
		? channel.users.find((u) => u.nick === network.nick) || {}
		: {};

	const whois = () => {
		const chan = network.channels.find((c) => c.name === user.nick);

		if (chan) {
			switchToChannel(chan);
		}

		socket.emit("input", {
			target: channel.id,
			text: "/whois " + user.nick,
		});
	};

	const items: ContextMenuItem[] = [
		{
			label: user.nick,
			type: "item",
			class: "user",
			action: whois,
		},
		{
			type: "divider",
		},
		{
			label: "Information de l'utilisateur",
			type: "item",
			class: "action-whois",
			action: whois,
		},
		{
			label: "Bloquer",
			type: "item",
			class: "action-ignore",
			action() {
				socket.emit("input", {
					target: channel.id,
					text: "/ignore " + user.nick,
				});
			},
		},
		{
			label: "Message privé",
			type: "item",
			class: "action-query",
			action() {
				const chan = store.getters.findChannelOnCurrentNetwork(user.nick);

				if (chan) {
					switchToChannel(chan);
				}

				socket.emit("input", {
					target: channel.id,
					text: "/query " + user.nick,
				});
			},
		},
	];

	// Bail because we're in a query or we don't have a special mode.
	if (!currentChannelUser.modes || currentChannelUser.modes.length < 1) {
		return items;
	}

	// Names of the standard modes we are able to change
	const modeCharToName = {
		"~": "owner",
		"&": "admin",
		"@": "operator",
		"%": "half-op",
		"+": "voice",
	};

	// Labels for the mode changes.  For example .rev({mode: "a", symbol: "&"}) => 'Revoke admin (-a)'
	const modeTextTemplate = {
		revoke(m: {symbol: string; mode: string}) {
			const name = modeCharToName[m.symbol];

			if (typeof name !== "string") {
				return "";
			}

			const res = name ? `Revoke ${name} (-${m.mode})` : `Mode -${m.mode}`;
			return res;
		},
		give(m: {symbol: string; mode: string}) {
			const name = modeCharToName[m.symbol];

			if (typeof name !== "string") {
				return "";
			}

			const res = name ? `Give ${name} (+${m.mode})` : `Mode +${m.mode}`;
			return res;
		},
	};

	const networkModeSymbols = network.serverOptions.PREFIX.symbols;

	/**
	 * Determine whether the prefix of mode p1 has access to perform actions on p2.
	 *
	 * EXAMPLE:
	 *    compare('@', '@') => true
	 *    compare('&', '@') => true
	 *    compare('+', '~') => false
	 * @param {string} p1 The mode performing an action
	 * @param {string} p2 The target mode
	 *
	 * @return {boolean} whether p1 can perform an action on p2
	 */
	function compare(p1: string, p2: string): boolean {
		// The modes ~ and @ can perform actions on their own mode.  The others on modes below.
		return "~@".indexOf(p1) > -1
			? networkModeSymbols.indexOf(p1) <= networkModeSymbols.indexOf(p2)
			: networkModeSymbols.indexOf(p1) < networkModeSymbols.indexOf(p2);
	}

	network.serverOptions.PREFIX.prefix.forEach((mode) => {
		if (!compare(currentChannelUser.modes[0], mode.symbol)) {
			// Our highest mode is below the current mode.  Bail.
			return;
		}

		if (!user.modes.includes(mode.symbol)) {
			// The target doesn't already have this mode, therefore we can set it.
			items.push({
				label: modeTextTemplate.give(mode),
				type: "item",
				class: "action-set-mode",
				action() {
					socket.emit("input", {
						target: channel.id,
						text: "/mode +" + mode.mode + " " + user.nick,
					});
				},
			});
		} else {
			items.push({
				label: modeTextTemplate.revoke(mode),
				type: "item",
				class: "action-revoke-mode",
				action() {
					socket.emit("input", {
						target: channel.id,
						text: "/mode -" + mode.mode + " " + user.nick,
					});
				},
			});
		}
	});

	// Determine if we are half-op or op depending on the network modes so we can kick.
	if (!compare(networkModeSymbols.indexOf("%") > -1 ? "%" : "@", currentChannelUser.modes[0])) {
		// Check if the target user has no mode or a mode lower than ours.
		if (user.modes.length === 0 || compare(currentChannelUser.modes[0], user.modes[0])) {
			items.push({
				label: "Expulser",
				type: "item",
				class: "action-kick",
				action() {
					socket.emit("input", {
						target: channel.id,
						text: "/kick " + user.nick,
					});
				},
			});
		}
	}

	return items;
}
