import { io, Socket } from "socket.io-client";
import type { AuthRequest } from "models/auth/authRequest";
import type { IServerToClientEvents } from "models/websocket/serverToClientEvents";
import type { IClientToServerEvents } from "models/websocket/clientToServerEvents";

import { login } from "./socket/login";
import { disconnect } from "./socket/disconnect";

export class WebsocketService {
	static socket: Socket<IServerToClientEvents, IClientToServerEvents> | null =
		null;
	static ready: boolean = true;

	static connect(authRequest: AuthRequest) {
		const hostname = `${location.protocol}//${location.hostname}`;
		this.socket = io(hostname, {
			auth: authRequest,
			path: "/socket",
		});

		this.socket.on("login", login);
		this.socket.on("disconnect", disconnect);
	}

	static disconnect() {
		this.socket.disconnect();
	}
}
