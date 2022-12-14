import * as io from "socket.io";
import * as http from "http";

import { join } from "./routes/join";
import { leave } from "./routes/leave";

import { IInterServerEvents } from "./eventInterfaces/IInterServerEvents";
import { IClientToServerEvents } from "models/websocket/clientToServerEvents";
import { IServerToClientEvents } from "models/websocket/serverToClientEvents";
import { ISocketData } from "./eventInterfaces/ISocketData";

export class WebSocketHandler {
	io: io.Server<
		IClientToServerEvents,
		IServerToClientEvents,
		IInterServerEvents,
		ISocketData
	>;

	constructor(httpServer: http.Server) {
		this.io = new io.Server<
			IClientToServerEvents,
			IServerToClientEvents,
			IInterServerEvents,
			ISocketData
		>(httpServer, {
			path: "/socket",
		});
	}

	async start(): Promise<void> {
		this.io.on("connection", async (socket) => {
			join(socket);
			leave(socket);
		});
	}
}
