<template>
	<div id="help" class="window" role="tabpanel" aria-label="Help">
		<div class="header">
			<SidebarToggle />
		</div>
		<div class="container">
			<h1 class="title">Aide</h1>

			<h2 class="help-version-title">
				<span>À propos de The Lounge</span>
				<small>
					v{{ store.state.serverConfiguration?.version }} (<router-link
						id="view-changelog"
						to="/changelog"
						>Notes de version</router-link
					>)
				</small>
			</h2>

			<div class="about">
				<VersionChecker />

				<template v-if="store.state.serverConfiguration?.gitCommit">
					<p>
						The Lounge a démarré depuis la source (<a
							:href="`https://github.com/thelounge/thelounge/tree/${store.state.serverConfiguration?.gitCommit}`"
							target="_blank"
							rel="noopener"
							>commit <code>{{ store.state.serverConfiguration?.gitCommit }}</code></a
						>).
					</p>

					<ul>
						<li>
							Comparer
							<a
								:href="`https://github.com/thelounge/thelounge/compare/${store.state.serverConfiguration?.gitCommit}...master`"
								target="_blank"
								rel="noopener"
								>entre
								<code>{{ store.state.serverConfiguration?.gitCommit }}</code> et
								<code>master</code></a
							>
							pour voir ce qui manque
						</li>
						<li>
							Comparer
							<a
								:href="`https://github.com/thelounge/thelounge/compare/${store.state.serverConfiguration?.version}...${store.state.serverConfiguration?.gitCommit}`"
								target="_blank"
								rel="noopener"
								>entre
								<code>{{ store.state.serverConfiguration?.version }}</code> et
								<code>{{ store.state.serverConfiguration?.gitCommit }}</code></a
							>
							pour voir les changements locaux
						</li>
					</ul>
				</template>

				<p>
					<a
						href="https://thelounge.chat/"
						target="_blank"
						rel="noopener"
						class="website-link"
						>Site web</a
					>
				</p>
				<p>
					<a
						href="https://thelounge.chat/docs/"
						target="_blank"
						rel="noopener"
						class="documentation-link"
						>Documentation</a
					>
				</p>
				<p>
					<a
						href="https://github.com/thelounge/thelounge/issues/new"
						target="_blank"
						rel="noopener"
						class="report-issue-link"
						>Signaler un problème…</a
					>
				</p>
			</div>

			<h2 v-if="isTouch">Mouvements tactiles</h2>

			<div v-if="isTouch" class="help-item">
				<div class="subject gesture">Glissement simple sur la gauche</div>
				<div class="description">
					<p>Masquer la bar latérale.</p>
				</div>
			</div>

			<div v-if="isTouch" class="help-item">
				<div class="subject gesture">Glissement simple sur la droite</div>
				<div class="description">
					<p>Afficher la bar latérale.</p>
				</div>
			</div>

			<div v-if="isTouch" class="help-item">
				<div class="subject gesture">Glissement double sur la gauche</div>
				<div class="description">
					<p>Basculer vers la prochaine fenêtre dans la liste des canaux.</p>
				</div>
			</div>

			<div v-if="isTouch" class="help-item">
				<div class="subject gesture">Glissement double sur la droite</div>
				<div class="description">
					<p>Basculer vers la fenêtre précédente dans la liste des canaux.</p>
				</div>
			</div>

			<h2>Raccourcis clavier</h2>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>↓</kbd></span>
					<span v-else><kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>↓</kbd></span>
				</div>
				<div class="description">
					<p>Basculer vers le prochain lobby de la liste des canaux.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>↑</kbd></span>
					<span v-else><kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>↑</kbd></span>
				</div>
				<div class="description">
					<p>Basculer vers le lobby précédent de la liste des canaux.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>←</kbd></span>
					<span v-else><kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd></span>
				</div>
				<div class="description">
					<p>Réduire le réseau actuel.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>→</kbd></span>
					<span v-else><kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd></span>
				</div>
				<div class="description">
					<p>Etendre le réseau actuel.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Alt</kbd> <kbd>↓</kbd></span>
					<span v-else><kbd>⌥</kbd> <kbd>↓</kbd></span>
				</div>
				<div class="description">
					<p>Basculer vers la prochaine fenêtre dans la liste des canaux.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Alt</kbd> <kbd>↑</kbd></span>
					<span v-else><kbd>⌥</kbd> <kbd>↑</kbd></span>
				</div>
				<div class="description">
					<p>Basculer vers la fenêtre précédente dans la liste des canaux.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Alt</kbd> <kbd>Ctrl</kbd> <kbd>↓</kbd></span>
					<span v-else><kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>↓</kbd></span>
				</div>
				<div class="description">
					<p>Basculer vers la prochaine fenêtre avec des messages non lu dans la liste des canaux.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Alt</kbd> <kbd>Ctrl</kbd> <kbd>↑</kbd></span>
					<span v-else><kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>↑</kbd></span>
				</div>
				<div class="description">
					<p>Basculer vers la précédente fenêtre avec des messages non lu dans la liste des canaux.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Alt</kbd> <kbd>A</kbd></span>
					<span v-else><kbd>⌥</kbd> <kbd>A</kbd></span>
				</div>
				<div class="description">
					<p>Basculer vers la première fenêtre avec des messages non lu dans la liste des canaux.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Alt</kbd> <kbd>S</kbd></span>
					<span v-else><kbd>⌥</kbd> <kbd>S</kbd></span>
				</div>
				<div class="description">
					<p>Bar latérale.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Alt</kbd> <kbd>U</kbd></span>
					<span v-else><kbd>⌥</kbd> <kbd>U</kbd></span>
				</div>
				<div class="description">
					<p>Liste des utilisateurs du canal.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Alt</kbd> <kbd>J</kbd></span>
					<span v-else><kbd>⌥</kbd> <kbd>J</kbd></span>
				</div>
				<div class="description">
					<p>Bascule automatique de canal.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Alt</kbd> <kbd>M</kbd></span>
					<span v-else><kbd>⌥</kbd> <kbd>M</kbd></span>
				</div>
				<div class="description">
					<p>Popup mentions récentes.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Alt</kbd> <kbd>/</kbd></span>
					<span v-else><kbd>⌥</kbd> <kbd>/</kbd></span>
				</div>
				<div class="description">
					<p>Basculer sur le menu d'aide.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span><kbd>Esc</kbd></span>
				</div>
				<div class="description">
					<p>
						Fermer la fenêtre contextuel actuelle (Menu contextuel, Prévisualisation, modification de sujet,
						etc) et défocalisation du champ actif.
					</p>
				</div>
			</div>

			<h2>Raccourcis de formatage</h2>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Ctrl</kbd> <kbd>K</kbd></span>
					<span v-else><kbd>⌘</kbd> <kbd>K</kbd></span>
				</div>
				<div class="description">
					<p>
						Marquer tout texte à la suite de ce raccourci pour qu'il soit coloré. Après usage de ce raccourci, saisir un entier dans la plage
						<code>0—15</code> pour choisir la couleur ou utiliser l'autocompletion.
						menu de selection de couleur (voir ci-dessous).
					</p>
					<p>
						La couleur de fond peut être spécifiée en ajoutant un autre entier dans la plage<code>0-15</code> après une virgule.
						(l'autocomplétion fonctionne également).
					</p>
					<p>
						Liste des références couleurs
						<a
							href="https://modern.ircdocs.horse/formatting.html#colors"
							target="_blank"
							rel="noopener"
							>ici</a
						>.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Ctrl</kbd> <kbd>B</kbd></span>
					<span v-else><kbd>⌘</kbd> <kbd>B</kbd></span>
				</div>
				<div class="description">
					<p>
						Marquer tout texte à la suite de ce raccourci comme
						<span class="irc-bold">gras</span>.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Ctrl</kbd> <kbd>U</kbd></span>
					<span v-else><kbd>⌘</kbd> <kbd>U</kbd></span>
				</div>
				<div class="description">
					<p>
						Marquer tout texte à la suite de ce raccourci comme
						<span class="irc-underline">souligné</span>.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Ctrl</kbd> <kbd>I</kbd></span>
					<span v-else><kbd>⌘</kbd> <kbd>I</kbd></span>
				</div>
				<div class="description">
					<p>
						Marquer tout texte à la suite de ce raccourci comme
						<span class="irc-italic">italique</span>.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Ctrl</kbd> <kbd>S</kbd></span>
					<span v-else><kbd>⌘</kbd> <kbd>S</kbd></span>
				</div>
				<div class="description">
					<p>
						Marquer tout texte à la suite de ce raccourci comme
						<span class="irc-strikethrough">barré</span>.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Ctrl</kbd> <kbd>M</kbd></span>
					<span v-else><kbd>⌘</kbd> <kbd>M</kbd></span>
				</div>
				<div class="description">
					<p>
						Marquer tout texte à la suite de ce raccourci comme
						<span class="irc-monospace">Espacement fixe</span>.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<span v-if="!isApple"><kbd>Ctrl</kbd> <kbd>O</kbd></span>
					<span v-else><kbd>⌘</kbd> <kbd>O</kbd></span>
				</div>
				<div class="description">
					<p>
						Marquer tout texte à la suite de ce raccourci pour réinitilaliser son format d'origine.
					</p>
				</div>
			</div>

			<h2>Autocomplétion</h2>

			<p>
				Pour autocompléter les pseudos, canaux, commandes, et emoji, tapez l'un des caractères suivant 
				pour ouvrir une liste de suggestion. Utilisez les touches <kbd>↑</kbd> et
				<kbd>↓</kbd> pour mettre en évidence un élément et tapez la touche <kbd>Tab</kbd> ou
				<kbd>Entrée</kbd> pour l'insérer (ou en cliquant sur l'élément désiré).
			</p>
			<p>Autocompletion can be disabled in settings.</p>

			<div class="help-item">
				<div class="subject">
					<code>@</code>
				</div>
				<div class="description">
					<p>Pseudo</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>#</code>
				</div>
				<div class="description">
					<p>Canal</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/</code>
				</div>
				<div class="description">
					<p>Commandes (voir liste des commandes ci-dessous)</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>:</code>
				</div>
				<div class="description">
					<p>
						Emoji (note: requière deux caractères de recherche pour éviter les conflits avec 
						les smileys du type <code>:)</code>)
					</p>
				</div>
			</div>

			<h2>Commandes</h2>

			<div class="help-item">
				<div class="subject">
					<code>/away [message]</code>
				</div>
				<div class="description">
					<p>Se marquer comme absent avec un message optionel.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/back</code>
				</div>
				<div class="description">
					<p>Enlever la statut absent (défini par <code>/away</code>).</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/ban pseudo</code>
				</div>
				<div class="description">
					<p>
						Bannir (<code>+b</code>) un utilisateur du canal actuel. Peut être un pseudo ou un sous réseau.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/banlist</code>
				</div>
				<div class="description">
					<p>Affiche la liste des bannis du canal actuel.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/collapse</code>
				</div>
				<div class="description">
					<p>
						Réduire toutes les prévisualisations dans le canal actuel (l'inverse de
						<code>/expand</code>)
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/connect hôte [port]</code>
				</div>
				<div class="description">
					<p>
						Connexion à un nouveau réseau IRC. Si le <code>port</code> commence par un signe
						<code>+</code>, la connexion utilisera TLS.
					</p>
					<p>Alias: <code>/server</code></p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/ctcp cible commande [arguments]</code>
				</div>
				<div class="description">
					<p>
						Envoyer une requête <abbr title="Client-to-client protocol">CTCP</abbr>
						Lire d'avantage à ce sujet sur
						<a
							href="https://en.wikipedia.org/wiki/Client-to-client_protocol"
							target="_blank"
							rel="noopener"
							>l'article dédié wikipedia</a
						>.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/deop pseudo [...pseudo]</code>
				</div>
				<div class="description">
					<p>
						Retire op (<code>-o</code>) d'un ou plusieurs utilisateurs dans le canal actuel.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/devoice pseudo [...pseudo]</code>
				</div>
				<div class="description">
					<p>
						Rendre muet (<code>-v</code>) un ou plusieurs utilisateurs du canal actuel.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/disconnect [message]</code>
				</div>
				<div class="description">
					<p>Se déconnecter du réseau actuel avec un message optionel.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/expand</code>
				</div>
				<div class="description">
					<p>
						Etendre toutes les prévisualisations du canal actuel (l'opposé de <code>/collapse</code>)
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/invite pseudo [canal]</code>
				</div>
				<div class="description">
					<p>
						Inviter un utilisateur dans le canal spécifié. Si le <code>canal</code> n'est pas spécifié
						il sera invité dans le canal actuel.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/ignore pseudo</code>
				</div>
				<div class="description">
					<p>
						Bloquer l'utilisateur sur ce réseau. Cela peut être un pseudo ou un sous réseau.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/ignorelist</code>
				</div>
				<div class="description">
					<p>Affiche la liste des utilisateurs bloqués sur le réseau actuel.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/join canal [mot de passe]</code>
				</div>
				<div class="description">
					<p>
						Rejoindre un canal. Le <code>mot de passe</code> n'est requis que pour les canaux protégés par mots de passe.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/kick pseudo [raison]</code>
				</div>
				<div class="description">
					<p>Expulse un utilisateur du canal actuel avec un message d'explication.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/kickban pseudo [raison]</code>
				</div>
				<div class="description">
					<p>
						Expulse et banni (<code>+b</code>) un utilisateur du canal actuel. Contrairement à
						<code>/ban</code>, seul les pseudos (et non les sous réseaux) peuvent être utilisés.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/list</code>
				</div>
				<div class="description">
					<p>Lister les canaux de ce réseau.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/me message</code>
				</div>
				<div class="description">
					<p>
						Envoi un message dans le canal actuel. Il sera affiché à la troisième personne.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/mode options [arguments]</code>
				</div>
				<div class="description">
					<p>
						Défini les options suivantes au canal actuel si la fenêtre active est un canal,
						à un autre utilisateur si la fenêtre est une disscussion privée ou à vous même si c'est dans une fenêtre serveur.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/msg canal message</code>
				</div>
				<div class="description">
					<p>Envoyer un message dans le canal spécifié.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/mute [...canal]</code>
				</div>
				<div class="description">
					<p>
						Rend un canal muet (retire toutes notifications, mentions, indicateurs de surbrillance etc..).
						Réversible avec <code>/unmute</code>.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/nick pseudo</code>
				</div>
				<div class="description">
					<p>Changer de pseudo dans le réseau actuel.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/notice canal message</code>
				</div>
				<div class="description">
					<p>Envoi un message d'information au canal spécifié.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/op pseudo [...pseudo]</code>
				</div>
				<div class="description">
					<p>Octroie op (<code>+o</code>) à/aux utilisateur(s) spécifié(s) dans le canal actuel.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/part [canal]</code>
				</div>
				<div class="description">
					<p>
						Ferme le canal spécifié, conversation privée ou le canal actuel si <code>canal</code> n'est pas spécifié.
					</p>
					<p>Alias: <code>/close</code>, <code>/leave</code></p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/rejoin</code>
				</div>
				<div class="description">
					<p>
						Quite et rejoins immédiatement le canal actuel.
					</p>
					<p>Alias: <code>/cycle</code></p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/query pseudo</code>
				</div>
				<div class="description">
					<p>Envoi un message privé à l'utilisateur spécifié.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/quit [message]</code>
				</div>
				<div class="description">
					<p>Se déconnecte du réseau actuel avec un message optionel.</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/raw message</code>
				</div>
				<div class="description">
					<p>Envoi un message brut au réseau IRC actuel.</p>
					<p>Alias: <code>/quote</code>, <code>/send</code></p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/slap pseudo</code>
				</div>
				<div class="description">
					<p>Slap l'utilisateur spécifié!</p>
				</div>
			</div>

			<div v-if="store.state.settings.searchEnabled" class="help-item">
				<div class="subject">
					<code>/search requete</code>
				</div>
				<div class="description">
					<p>Cherche un message dans le canal (ou discussion privée) actuel</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/topic [sujet]</code>
				</div>
				<div class="description">
					<p>
						Affiche le sujet du canal actuel. Si <code>sujet</code> est spécifié,
						change le sujet du canal actuel.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/unban pseudo</code>
				</div>
				<div class="description">
					<p>
						Débanni (<code>-b</code>) un utilisateur du canal actuel. Peut être un pseudo ou un sous-réseau.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/unignore pseudo</code>
				</div>
				<div class="description">
					<p>
						Débloque l'utilisateur spécifié sur le réseau actuel. Peut être un pseudo ou un sous-réseau.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/unmute [...canal]</code>
				</div>
				<div class="description">
					<p>
						Rétablis les capacités de notification du/des canal/canaux spéfifié(s) ou du canal actif si
						aucun spécifié. Voir <code>/mute</code> pour plus d'informations.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/voice pseudo [...pseudo]</code>
				</div>
				<div class="description">
					<p>
						Donne la parole (<code>+v</code>) à/aux utilisateur(s) spécifié(s) dans le canal actuel.
					</p>
				</div>
			</div>

			<div class="help-item">
				<div class="subject">
					<code>/whois pseudo</code>
				</div>
				<div class="description">
					<p>Affiche les informations de l'utilisateur spécifié dans le réseau actuel.</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {useStore} from "../../js/store";
import SidebarToggle from "../SidebarToggle.vue";
import VersionChecker from "../VersionChecker.vue";

export default defineComponent({
	name: "Help",
	components: {
		SidebarToggle,
		VersionChecker,
	},
	setup() {
		const store = useStore();
		const isApple = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) || false;
		const isTouch = navigator.maxTouchPoints > 0;

		return {
			isApple,
			isTouch,
			store,
		};
	},
});
</script>
