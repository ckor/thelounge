<template>
	<span class="content">
		<Username :user="message.from" />
		<span v-if="message.invitedYou">vous invite</span>
		<span v-else>invite <Username user="message.target" /></span>
		sur <ParsedMessage :network="network" :text="message.channel" />
	</span>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {ClientNetwork, ClientMessage} from "../../js/types";
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default defineComponent({
	name: "MessageTypeInvite",
	components: {
		ParsedMessage,
		Username,
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
});
</script>
