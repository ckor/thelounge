<template>
	<div id="version-checker" :class="[store.state.versionStatus]">
		<p v-if="store.state.versionStatus === 'loading'">Vérification des MAJ…</p>
		<p v-if="store.state.versionStatus === 'new-version'">
			The Lounge <b>{{ store.state.versionData?.latest.version }}</b>
			<template v-if="store.state.versionData?.latest.prerelease"> (pre-release) </template>
			disponible.
			<br />

			<a :href="store.state.versionData?.latest.url" target="_blank" rel="noopener">
				Plus de détails sur GitHub
			</a>
		</p>
		<p v-if="store.state.versionStatus === 'new-packages'">
			The Lounge is up to date, but there are out of date packages Run
			<code>thelounge upgrade</code> on the server to upgrade packages.
		</p>
		<template v-if="store.state.versionStatus === 'up-to-date'">
			<p>The Lounge is up to date!</p>

			<button
				v-if="store.state.versionDataExpired"
				id="check-now"
				class="btn btn-small"
				@click="checkNow"
			>
				Check now
			</button>
		</template>
		<template v-if="store.state.versionStatus === 'error'">
			<p>Information about latest release could not be retrieved.</p>

			<button id="check-now" class="btn btn-small" @click="checkNow">Try again</button>
		</template>
	</div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import socket from "../js/socket";
import {useStore} from "../js/store";

export default defineComponent({
	name: "VersionChecker",
	setup() {
		const store = useStore();

		const checkNow = () => {
			store.commit("versionData", null);
			store.commit("versionStatus", "loading");
			socket.emit("changelog");
		};

		onMounted(() => {
			if (!store.state.versionData) {
				checkNow();
			}
		});

		return {
			store,
			checkNow,
		};
	},
});
</script>
