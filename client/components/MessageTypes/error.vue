<template>
	<span class="content">
		<ParsedMessage :network="network" :message="message" :text="errorMessage" />
	</span>
</template>

<script lang="ts">
import ParsedMessage from "../ParsedMessage.vue";
import {computed, defineComponent, PropType} from "vue";
import {ClientNetwork, ClientMessage} from "../../js/types";

export default defineComponent({
	name: "MessageTypeError",
	components: {
		ParsedMessage,
	},
	props: {
		network: {
			type: Object as PropType<ClientNetwork>,
			required: true,
		},
		message: {
			type: Object as PropType<ClientMessage>,
			required: true,
		},
	},
	setup(props) {
		const errorMessage = computed(() => {
			// TODO: enforce chan and nick fields so that we can get rid of that
			const chan = props.message.channel || "!UNKNOWN_CHAN";
			const nick = props.message.nick || "!UNKNOWN_NICK";

			switch (props.message.error) {
				case "bad_channel_key":
					return `Impossible de rejoindre ${chan} - Mauvais mot de passe de canal.`;
				case "banned_from_channel":
					return `Impossible de rejoindre ${chan} - Vous etes bannis du canal..`;
				case "cannot_send_to_channel":
					return `Impossible de communiquer avec le canal ${chan}`;
				case "channel_is_full":
					return `Impossible de rejoindre ${chan} - Canal plein.`;
				case "chanop_privs_needed":
					return "Action impossible: Permissions insuffisantes.";
				case "invite_only_channel":
					return `Impossible de rejoindre ${chan} - Canal sur invitation uniquement.`;
				case "no_such_nick":
					return `${nick} ne s'est pas connecté ou n'existe pas.`;
				case "not_on_channel":
					return "Action impossible: Vous n'etes pas sur le canal.";
				case "password_mismatch":
					return "Erreur de mot de passe.";
				case "too_many_channels":
					return `Impossible de rejoindre ${chan} - Vous avez atteint la limite de connexions simultané aux cannaux.`;
				case "unknown_command":
					// TODO: not having message.command should never happen, so force existence
					return `Commande inconnue: ${props.message.command || "!UNDEFINED_COMMAND_BUG"}`;
				case "user_not_in_channel":
					return `${nick} n'est pas sur le canal.`;
				case "user_on_channel":
					return `${nick} est déjà sur le canal.`;
				default:
					if (props.message.reason) {
						return `${props.message.reason} (${
							props.message.error || "!UNDEFINED_ERR"
						})`;
					}

					return props.message.error;
			}
		});

		return {
			errorMessage,
		};
	},
});
</script>
