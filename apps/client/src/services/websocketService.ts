import { io, Socket } from "socket.io-client";
import type { IServerToClientEvents } from "data-transfer-interfaces/websocket/serverToClientEvents";
import type { IClientToServerEvents } from "data-transfer-interfaces/websocket/clientToServerEvents";
import { host } from "../util/host";

export class WebsocketService {
	static socket: Socket<IServerToClientEvents, IClientToServerEvents> | null =
		null;
	static ready: boolean = true;

	static connect(jwt: string) {
		const hostname = host();
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
