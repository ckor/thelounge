<template>
	<table class="ban-list">
		<thead>
			<tr>
				<th class="hostmask">Banni</th>
				<th class="banned_by">Banni par</th>
				<th class="banned_at">Banni à</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="ban in channel.data" :key="ban.hostmask">
				<td class="hostmask"><ParsedMessage :network="network" :text="ban.hostmask" /></td>
				<td class="banned_by">{{ ban.banned_by }}</td>
				<td class="banned_at">{{ localetime(ban.banned_at) }}</td>
			</tr>
		</tbody>
	</table>
</template>

<script lang="ts">
import ParsedMessage from "../ParsedMessage.vue";
import localeTime from "../../js/helpers/localetime";
import {defineComponent, PropType} from "vue";
import type {ClientNetwork, ClientChan} from "../../js/types";

export default defineComponent({
	name: "ListBans",
	components: {
		ParsedMessage,
	},
	props: {
		network: {type: Object as PropType<ClientNetwork>, required: true},
		channel: {type: Object as PropType<ClientChan>, required: true},
	},
	setup() {
		const localetime = (date: number | Date) => {
			return localeTime(date);
		};

		return {
			localetime,
		};
	},
});
</script>
