import * as io from "socket.io";
import * as http from "http";
import { IClientToServerEvents } from "./eventInterfaces/IClientToServerEvents";
import { IInterServerEvents } from "./eventInterfaces/IInterServerEvents";
import { IServerToClientEvents } from "./eventInterfaces/IServerToClientEvents";
import { ISocketData } from "./eventInterfaces/ISocketData";

export class WebSocketHandler {
	io: io.Server<
		IClientToServerEvents,
		IInterServerEvents,
		IServerToClientEvents,
		ISocketData
	>;

	constructor(httpServer: http.Server) {
		this.io = new io.Server<
			IClientToServerEvents,
			IInterServerEvents,
			IServerToClientEvents,
			ISocketData
		>(httpServer, {
			path: "/socket",
		});
	}

	async start(): Promise<void> {
		this.io.on("connection", (socket) => {
			console.log("connection", socket.handshake.auth);
		});
	}
}
