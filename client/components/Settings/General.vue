<template>
	<div>
		<div v-if="canRegisterProtocol || hasInstallPromptEvent">
			<h2>Application native</h2>
			<button
				v-if="hasInstallPromptEvent"
				type="button"
				class="btn"
				@click.prevent="nativeInstallPrompt"
			>
				Ajouter thelounge au bureau
			</button>
			<button
				v-if="canRegisterProtocol"
				type="button"
				class="btn"
				@click.prevent="registerProtocol"
			>
				Ouvrir irc:// URLs with The Lounge
			</button>
		</div>
		<div v-if="store.state.serverConfiguration?.fileUpload">
			<h2>Uploads</h2>
			<div>
				<label class="opt">
					<input
						:checked="store.state.settings.uploadCanvas"
						type="checkbox"
						name="uploadCanvas"
					/>
					Tentative de suppression des métadonnées avant upload.
					<span
						class="tooltipped tooltipped-n tooltipped-no-delay"
						aria-label="Non supporté par tous les navigateurs"
					>
						<button class="extra-help" />
					</span>
				</label>
			</div>
		</div>
		<div v-if="!store.state.serverConfiguration?.public">
			<h2>Synchronisation des paramètres</h2>
			<label class="opt">
				<input
					:checked="store.state.settings.syncSettings"
					type="checkbox"
					name="syncSettings"
				/>
				Synchronisation des paramètres avec les autres clients
			</label>
			<template v-if="!store.state.settings.syncSettings">
				<div v-if="store.state.serverHasSettings" class="settings-sync-panel">
					<p>
						<strong>Attention:</strong> Cette case ecrasera les paramètres locaux par ceux sur le serveur.
					</p>
					<p>
						Utilisez le bouton ci-dessous pour activer la synchronisation et appliquer les paramètres.
						Synchronisé.
					</p>
					<button type="button" class="btn btn-small" @click="onForceSyncClick">
						Synchroniser et appliquer
					</button>
				</div>
				<div v-else class="settings-sync-panel">
					<p>
						<strong>Attention:</strong> Aucun paramètre synchronisé au préalabe,
						cela synchronisera tous les paramètres du client avec ceux de base..
					</p>
				</div>
			</template>
		</div>
		<div v-if="!store.state.serverConfiguration?.public">
			<h2>Message d absence automatique</h2>

			<label class="opt">
				<label for="awayMessage" class="sr-only">Automatic away message</label>
				<input
					id="awayMessage"
					:value="store.state.settings.awayMessage"
					type="text"
					name="awayMessage"
					class="input"
					placeholder="Message d'absence"
				/>
			</label>
		</div>
	</div>
</template>

<style></style>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {useStore} from "../../js/store";
import {BeforeInstallPromptEvent} from "../../js/types";

let installPromptEvent: BeforeInstallPromptEvent | null = null;

window.addEventListener("beforeinstallprompt", (e) => {
	e.preventDefault();
	installPromptEvent = e as BeforeInstallPromptEvent;
});

export default defineComponent({
	name: "GeneralSettings",
	setup() {
		const store = useStore();
		const canRegisterProtocol = ref(false);

		const hasInstallPromptEvent = computed(() => {
			// TODO: This doesn't hide the button after clicking
			return installPromptEvent !== null;
		});

		onMounted(() => {
			// Enable protocol handler registration if supported,
			// and the network configuration is not locked
			canRegisterProtocol.value =
				!!window.navigator.registerProtocolHandler &&
				!store.state.serverConfiguration?.lockNetwork;
		});

		const nativeInstallPrompt = () => {
			if (!installPromptEvent) {
				return;
			}

			installPromptEvent.prompt().catch((e) => {
				// eslint-disable-next-line no-console
				console.error(e);
			});

			installPromptEvent = null;
		};

		const onForceSyncClick = () => {
			store.dispatch("settings/syncAll", true).catch((e) => {
				// eslint-disable-next-line no-console
				console.error(e);
			});

			store
				.dispatch("settings/update", {
					name: "syncSettings",
					value: true,
					sync: true,
				})
				.catch((e) => {
					// eslint-disable-next-line no-console
					console.error(e);
				});
		};

		const registerProtocol = () => {
			const uri = document.location.origin + document.location.pathname + "?uri=%s";
			// @ts-expect-error
			// the third argument is deprecated but recommended for compatibility: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler
			window.navigator.registerProtocolHandler("irc", uri, "The Lounge");
			// @ts-expect-error
			window.navigator.registerProtocolHandler("ircs", uri, "The Lounge");
		};

		return {
			store,
			canRegisterProtocol,
			hasInstallPromptEvent,
			nativeInstallPrompt,
			onForceSyncClick,
			registerProtocol,
		};
	},
});
</script>
