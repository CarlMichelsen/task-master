import { io, Socket } from "socket.io-client";
import type { IServerToClientEvents } from "models/websocket/serverToClientEvents";
import type { IClientToServerEvents } from "models/websocket/clientToServerEvents";

export class WebsocketService {
	static socket: Socket<IServerToClientEvents, IClientToServerEvents> | null =
		null;
	static ready: boolean = true;

	static connect(jwt: string) {
		const hostname = `${location.protocol}//${location.hostname}`;
		this.socket = io(hostname, {
			auth: { jwt },
			path: "/socket",
		});

		//this.socket.on("login", login);
		//this.socket.on("disconnect", disconnect);
	}

	static disconnect() {
		this.socket.disconnect();
	}
}
