<template>
	<span class="content">
		<p>
			<Username :user="{nick: message.whois.nick}" />
			<span v-if="message.whois.whowas"> est hors ligne, dernière information:</span>
		</p>

		<dl class="whois">
			<template v-if="message.whois.account">
				<dt>Connecté en tant que:</dt>
				<dd>{{ message.whois.account }}</dd>
			</template>

			<dt>Sous reseau:</dt>
			<dd class="hostmask">
				<ParsedMessage
					:network="network"
					:text="message.whois.ident + '@' + message.whois.hostname"
				/>
			</dd>

			<template v-if="message.whois.actual_hostname">
				<dt>Reseau:</dt>
				<dd class="hostmask">
					<a
						:href="'https://ipinfo.io/' + message.whois.actual_ip"
						target="_blank"
						rel="noopener"
						>{{ message.whois.actual_ip }}</a
					>
					<i v-if="message.whois.actual_hostname != message.whois.actual_ip">
						({{ message.whois.actual_hostname }})</i
					>
				</dd>
			</template>

			<template v-if="message.whois.actual_username">
				<dt>Identifiant:</dt>
				<dd>{{ message.whois.actual_username }}</dd>
			</template>

			<template v-if="message.whois.real_name">
				<dt>Nom:</dt>
				<dd><ParsedMessage :network="network" :text="message.whois.real_name" /></dd>
			</template>

			<template v-if="message.whois.registered_nick">
				<dt>Pseudo:</dt>
				<dd>{{ message.whois.registered_nick }}</dd>
			</template>

			<template v-if="message.whois.channels">
				<dt>Canaux:</dt>
				<dd><ParsedMessage :network="network" :text="message.whois.channels" /></dd>
			</template>

			<template v-if="message.whois.modes">
				<dt>Modes:</dt>
				<dd>{{ message.whois.modes }}</dd>
			</template>

			<template v-if="message.whois.special">
				<template v-for="special in message.whois.special" :key="special">
					<dt>Special:</dt>
					<dd>{{ special }}</dd>
				</template>
			</template>

			<template v-if="message.whois.operator">
				<dt>Operateur:</dt>
				<dd>{{ message.whois.operator }}</dd>
			</template>

			<template v-if="message.whois.helpop">
				<dt>Disponible pour aider:</dt>
				<dd>oui</dd>
			</template>

			<template v-if="message.whois.bot">
				<dt>Est un robot:</dt>
				<dd>Oui</dd>
			</template>

			<template v-if="message.whois.away">
				<dt>Absent:</dt>
				<dd><ParsedMessage :network="network" :text="message.whois.away" /></dd>
			</template>

			<template v-if="message.whois.secure">
				<dt>Connexion sécurisée:</dt>
				<dd>oui</dd>
			</template>

			<template v-if="message.whois.certfps">
				<template v-for="certfp in message.whois.certfps" :key="certfp">
					<dt>Certificat:</dt>
					<dd>{{ certfp }}</dd>
				</template>
			</template>

			<template v-if="message.whois.server">
				<dt>Connecté sur:</dt>
				<dd>
					{{ message.whois.server }} <i>({{ message.whois.server_info }})</i>
				</dd>
			</template>

			<template v-if="message.whois.logonTime">
				<dt>Connecté à:</dt>
				<dd>{{ localetime(message.whois.logonTime) }}</dd>
			</template>

			<template v-if="message.whois.idle">
				<dt>Temps inactivité:</dt>
				<dd>{{ localetime(message.whois.idleTime) }}</dd>
			</template>
		</dl>
	</span>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import localetime from "../../js/helpers/localetime";
import {ClientNetwork, ClientMessage} from "../../js/types";
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default defineComponent({
	name: "MessageTypeWhois",
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
	setup() {
		return {
			localetime: (date: Date) => localetime(date),
		};
	},
});
</script>
