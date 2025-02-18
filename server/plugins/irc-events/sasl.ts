import {IrcEventHandler} from "../../client";

import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("loggedin", (data) => {
		const lobby = network.getLobby();

		const msg = new Msg({
			type: MessageType.LOGIN,
			text: "Connecté avec: " + data.account,
		});
		lobby.pushMessage(client, msg, true);
	});

	irc.on("loggedout", () => {
		const lobby = network.getLobby();

		const msg = new Msg({
			type: MessageType.LOGOUT,
			text: "Déconnecté",
		});
		lobby.pushMessage(client, msg, true);
	});
};
