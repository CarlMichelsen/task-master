import * as io from "socket.io";
import { AuthRequest } from "models/auth/authRequest";
import { IClientToServerEvents } from "models/websocket/clientToServerEvents";
import { IServerToClientEvents } from "models/websocket/serverToClientEvents";

import { IInterServerEvents } from "../../eventInterfaces/IInterServerEvents";
import { ISocketData } from "../../eventInterfaces/ISocketData";
import { connect } from "./connect";

export const login = async (
	socket: io.Socket<
		IClientToServerEvents,
		IServerToClientEvents,
		IInterServerEvents,
		ISocketData
	>
) => {
	const authRequest = socket.handshake.auth as AuthRequest;
	const authResponse = await connect(authRequest);
	if (!authResponse.authenticated || !authResponse.clientUser?.id) {
		console.log("Failed connection attempt");
		socket.disconnect(true);
		return;
	}

	socket.data = {
		id: authResponse.clientUser.id,
		name: authResponse.clientUser.username,
	};

	socket.emit("login", authResponse);
	console.log(socket.data.name, "logged in");

	socket.on("disconnect", () => console.log(socket.data.name, "logged out"));
};
