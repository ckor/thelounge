<template>
	<div :class="['msg', {closed: isCollapsed}]" data-type="condensed">
		<div class="condensed-summary">
			<span class="time" />
			<span class="from" />
			<span class="content" @click="onCollapseClick"
				>{{ condensedText
				}}<button class="toggle-button" aria-label="Status de messages"
			/></span>
		</div>
		<Message
			v-for="message in messages"
			:key="message.id"
			:network="network"
			:message="message"
		/>
	</div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref} from "vue";
import {condensedTypes} from "../../shared/irc";
import {MessageType} from "../../shared/types/msg";
import {ClientMessage, ClientNetwork} from "../js/types";
import Message from "./Message.vue";

export default defineComponent({
	name: "MessageCondensed",
	components: {
		Message,
	},
	props: {
		network: {type: Object as PropType<ClientNetwork>, required: true},
		messages: {
			type: Array as PropType<ClientMessage[]>,
			required: true,
		},
		keepScrollPosition: {
			type: Function as PropType<() => void>,
			required: true,
		},
		focused: Boolean,
	},
	setup(props) {
		const isCollapsed = ref(true);

		const onCollapseClick = () => {
			isCollapsed.value = !isCollapsed.value;
			props.keepScrollPosition();
		};

		const condensedText = computed(() => {
			const obj: Record<string, number> = {};

			condensedTypes.forEach((type) => {
				obj[type] = 0;
			});

			for (const message of props.messages) {
				// special case since one MODE message can change multiple modes
				if (message.type === MessageType.MODE) {
					// syntax: +vv-t maybe-some targets
					// we want the number of mode changes in the message, so count the
					// number of chars other than + and - before the first space
					const text = message.text ? message.text : "";
					const modeChangesCount = text
						.split(" ")[0]
						.split("")
						.filter((char) => char !== "+" && char !== "-").length;
					obj[message.type] += modeChangesCount;
				} else {
					if (!message.type) {
						/* eslint-disable no-console */
						console.log(`Type de message vide, cela ne devrait pas se produire: ${message.id}`);
						continue;
					}

					obj[message.type]++;
				}
			}

			// Count quits as parts in condensed messages to reduce information density
			obj.part += obj.quit;

			const strings: string[] = [];
			condensedTypes.forEach((type) => {
				if (obj[type]) {
					switch (type) {
						case "chghost":
							strings.push(
								String(obj[type]) +
									(obj[type] > 1
										? " utilisateurs ont changés de noms d'hôte"
										: " utilisateur a changé de nom d'hôte")
							);
							break;
						case "join":
							strings.push(
								String(obj[type]) +
									(obj[type] > 1 ? " utilisateurs ont rejoint" : " utilisateur a rejoint")
							);
							break;
						case "part":
							strings.push(
								String(obj[type]) +
									(obj[type] > 1 ? " utilisateurs ont quitté" : " utilisateur a quitté")
							);
							break;
						case "nick":
							strings.push(
								String(obj[type]) +
									(obj[type] > 1
										? " utilisateurs ont changé de pseudo"
										: " utilisateur a changed de pseudo")
							);
							break;
						case "kick":
							strings.push(
								String(obj[type]) +
									(obj[type] > 1 ? " utilisateurs ont été expulsés" : " utilisateur a été expulsé")
							);
							break;
						case "mode":
							strings.push(
								String(obj[type]) +
									(obj[type] > 1 ? " modes ont été attribués" : " mode a été attribué")
							);
							break;
						case "away":
							strings.push("Marqué absent " + String(obj[type]) + " fois");
							break;
						case "back":
							strings.push("Marqué de retour " + String(obj[type]) + " fois");
							break;
					}
				}
			});

			if (strings.length) {
				let text = strings.pop();

				if (strings.length) {
					text = strings.join(", ") + ", et " + text!;
				}

				return text;
			}

			return "";
		});

		return {
			isCollapsed,
			condensedText,
			onCollapseClick,
		};
	},
});
</script>
