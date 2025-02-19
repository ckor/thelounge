import {IrcEventHandler} from "../../client";

import Chan from "../../models/chan";
import {ChanType, SpecialChanType} from "../../../shared/types/chan";

export default <IrcEventHandler>function (irc, network) {
	const client = this;
	const MAX_CHANS = 500;

	irc.on("channel list start", function () {
		network.chanCache = [];

		updateListStatus({
			text: "Chargement de la liste des canaux, cela peut prendre un moment...",
		});
	});

	irc.on("channel list", function (channels) {
		Array.prototype.push.apply(network.chanCache, channels);

		updateListStatus({
			text: `Chargé: ${network.chanCache.length} canaux...`,
		});
	});

	irc.on("channel list end", function () {
		updateListStatus(
			network.chanCache.sort((a, b) => b.num_users! - a.num_users!).slice(0, MAX_CHANS)
		);

		network.chanCache = [];
	});

	function updateListStatus(
		msg:
			| {
					text: string;
			  }
			| Chan[]
	) {
		let chan = network.getChannel("Channel List");

		if (typeof chan === "undefined") {
			chan = client.createChannel({
				type: ChanType.SPECIAL,
				special: SpecialChanType.CHANNELLIST,
				name: "Channel List",
				data: msg,
			});

			client.emit("join", {
				network: network.uuid,
				chan: chan.getFilteredClone(true),
				shouldOpen: false,
				index: network.addChannel(chan),
			});
		} else {
			chan.data = msg;

			client.emit("msg:special", {
				chan: chan.id,
				data: msg,
			});
		}
	}
};
