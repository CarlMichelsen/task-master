//import { Server } from "socket.io";
import { IClientToServerEvents } from "./eventInterfaces/IClientToServerEvents";
import { IInterServerEvents } from "./eventInterfaces/IInterServerEvents";
import { IServerToClientEvents } from "./eventInterfaces/IServerToClientEvents";
import { ISocketData } from "./eventInterfaces/ISocketData";

export class WebSocketHandler {
	/*io: Server<
		IClientToServerEvents,
		IInterServerEvents,
		IServerToClientEvents,
		ISocketData
	>;*/

	constructor(
		clientToServer: IClientToServerEvents,
		interServer: IInterServerEvents,
		serverToClient: IServerToClientEvents
	) {
		/*
		this.io = new Server<
			IClientToServerEvents,
			IInterServerEvents,
			IServerToClientEvents,
			ISocketData
		>();

		this.io.on("connection", (socket) => {
			console.log("connection", socket.handshake.auth);
		});
		*/
	}
}
