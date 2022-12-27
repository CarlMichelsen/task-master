import { io, Socket } from "socket.io-client";
import type { IServerToClientEvents } from "data-transfer-interfaces/websocket/serverToClientEvents";
import type { IClientToServerEvents } from "data-transfer-interfaces/websocket/clientToServerEvents";
import { host } from "../util/host";
import type { ClientUser } from "data-transfer-interfaces/user/clientUser";

export class WebsocketService {
	static socket: Socket<IServerToClientEvents, IClientToServerEvents> | null =
		null;
	static ready: boolean = true;

	static onConnect: (() => void) | null = null;
	static onDisconnect: (() => void) | null = null;
	static onUpdateConnected: ((connectedList: ClientUser[]) => void) | null =
		null;
	static onConnectedJoin: ((connectedList: ClientUser) => void) | null = null;
	static onConnectedLeave: ((connectedList: ClientUser) => void) | null = null;

	static connect(jwt: string, taskboardUri: string) {
		// disconnect if already connected
		this.disconnect();

		const hostname = host();
		this.socket = io(hostname, {
			auth: { jwt, uri: taskboardUri },
			path: "/socket",
		});

		this.socket.on("connect", () => {
			console.log("connect");
			this.onConnect && this.onConnect();
		});

		this.socket.on("updateConnected", (connected) => {
			console.log("updateConnected", connected);
			this.onUpdateConnected && this.onUpdateConnected(connected);
		});

		this.socket.on("onConnectedJoin", (connected) => {
			console.log("onConnectedJoin", connected);
			this.onConnectedJoin && this.onConnectedJoin(connected);
		});

		this.socket.on("onConnectedLeave", (connected) => {
			console.log("onConnectedLeave", connected);
			this.onConnectedLeave && this.onConnectedLeave(connected);
		});

		this.socket.on("disconnect", () => {
			console.log("disconnect");
			this.onDisconnect && this.onDisconnect();
		});
	}

	static disconnect() {
		this.socket && this.socket.disconnect();
	}
}
