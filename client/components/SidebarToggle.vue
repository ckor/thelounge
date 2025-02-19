<template>
	<button class="lt" aria-label="Liste des canaux" @click="store.commit('toggleSidebar')" />
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useStore} from "../js/store";

export default defineComponent({
	name: "SidebarToggle",
	setup() {
		const store = useStore();

		return {
			store,
		};
	},
});
</script>
