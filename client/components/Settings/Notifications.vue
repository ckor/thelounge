<template>
	<div>
		<template v-if="!store.state.serverConfiguration?.public">
			<h2>Push Notifications</h2>
			<div>
				<button
					id="pushNotifications"
					type="button"
					class="btn"
					:disabled="
						store.state.pushNotificationState !== 'supported' &&
						store.state.pushNotificationState !== 'subscribed'
					"
					@click="onPushButtonClick"
				>
					<template v-if="store.state.pushNotificationState === 'subscribed'">
						Désactivation des push notifications
					</template>
					<template v-else-if="store.state.pushNotificationState === 'loading'">
						Chargement…
					</template>
					<template v-else> Subscribe to push notifications </template>
				</button>
				<div v-if="store.state.pushNotificationState === 'nohttps'" class="error">
					<strong>Attention</strong>: Les push notifications sont supportées uniquement en HTTPS
					connections.
				</div>
				<div v-if="store.state.pushNotificationState === 'unsupported'" class="error">
					<strong>Attention</strong>:
					<span>Les push notifications ne sont pas gérées par votre navigateur.</span>
				</div>
			</div>
		</template>

		<h2>Notifications du navigateur</h2>
		<div>
			<label class="opt">
				<input
					id="desktopNotifications"
					:checked="store.state.settings.desktopNotifications"
					:disabled="store.state.desktopNotificationState === 'nohttps'"
					type="checkbox"
					name="desktopNotifications"
				/>
				Activer les notifications navigateur<br />
				<div v-if="store.state.desktopNotificationState === 'unsupported'" class="error">
					<strong>Attention</strong>: Notifications non gérées par votre navigateur.
				</div>
				<div
					v-if="store.state.desktopNotificationState === 'nohttps'"
					id="warnBlockedDesktopNotifications"
					class="error"
				>
					<strong>Attention</strong>: Les notifications sont supportées uniquement en HTTPS
					connections.
				</div>
				<div
					v-if="store.state.desktopNotificationState === 'blocked'"
					id="warnBlockedDesktopNotifications"
					class="error"
				>
					<strong>Attention</strong>: Votre navigateur bloque les notifications.
				</div>
			</label>
		</div>
		<div>
			<label class="opt">
				<input
					:checked="store.state.settings.notification"
					type="checkbox"
					name="notification"
				/>
				Activier le son des notifications
			</label>
		</div>
		<div>
			<div class="opt">
				<button id="play" @click.prevent="playNotification">Play sound</button>
			</div>
		</div>

		<div>
			<label class="opt">
				<input
					:checked="store.state.settings.notifyAllMessages"
					type="checkbox"
					name="notifyAllMessages"
				/>
				Activier les notifications pour tous les messages
			</label>
		</div>

		<div v-if="!store.state.serverConfiguration?.public">
			<label class="opt">
				<label for="highlights" class="opt">
					Surbrillance personalisée
					<span
						class="tooltipped tooltipped-n tooltipped-no-delay"
						aria-label="Liste de mots ou expressions séparé(e)s par des virgules qui seront mis en surbrillance."
					>
						<button class="extra-help" />
					</span>
				</label>
				<input
					id="highlights"
					:value="store.state.settings.highlights"
					type="text"
					name="highlights"
					class="input"
					autocomplete="off"
					placeholder="Séparé par des virgules, par exemple: Facture,Numéro de téléphone, Aide"
				/>
			</label>
		</div>

		<div v-if="!store.state.serverConfiguration?.public">
			<label class="opt">
				<label for="highlightExceptions" class="opt">
					Exceptions de surbrillance
					<span
						class="tooltipped tooltipped-n tooltipped-no-delay"
						aria-label="Liste de mots ou expressions séparé(e)s par des virgules à exclure de la surbrillance"
					>
						<button class="extra-help" />
					</span>
				</label>
				<input
					id="highlightExceptions"
					:value="store.state.settings.highlightExceptions"
					type="text"
					name="highlightExceptions"
					class="input"
					autocomplete="off"
					placeholder="Liste de mots ou expressions séparé(e)s par des virgules à exclure de la surbrillance"
				/>
			</label>
		</div>
	</div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {useStore} from "../../js/store";
import webpush from "../../js/webpush";

export default defineComponent({
	name: "NotificationSettings",
	setup() {
		const store = useStore();

		const isIOS = computed(
			() =>
				[
					"iPad Simulator",
					"iPhone Simulator",
					"iPod Simulator",
					"iPad",
					"iPhone",
					"iPod",
				].includes(navigator.platform) ||
				// iPad on iOS 13 detection
				(navigator.userAgent.includes("Mac") && "ontouchend" in document)
		);

		const playNotification = () => {
			const pop = new Audio();
			pop.src = "audio/pop.wav";

			// eslint-disable-next-line
			pop.play();
		};

		const onPushButtonClick = () => {
			webpush.togglePushSubscription();
		};

		return {
			isIOS,
			store,
			playNotification,
			onPushButtonClick,
		};
	},
});
</script>
