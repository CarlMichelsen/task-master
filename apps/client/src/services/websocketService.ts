import { io, Socket } from "socket.io-client";
import type { IServerToClientEvents } from "data-transfer-interfaces/websocket/serverToClientEvents";
import type { IClientToServerEvents } from "data-transfer-interfaces/websocket/clientToServerEvents";
import { host } from "../util/host";

export class WebsocketService {
	static socket: Socket<IServerToClientEvents, IClientToServerEvents> | null =
		null;
	static ready: boolean = true;

	static connect(jwt: string, taskboardUri: string) {
		const hostname = host();
		this.socket = io(hostname, {
			auth: { jwt, uri: taskboardUri },
			path: "/socket",
		});

		this.socket.on("connect", () => {
			console.log("connect");
		});

		this.socket.on("disconnect", () => {
			console.log("disconnect");
		});

		//this.socket.on("login", login);
		//this.socket.on("disconnect", disconnect);
	}

	static disconnect() {
		this.socket && this.socket.disconnect();
	}
}
