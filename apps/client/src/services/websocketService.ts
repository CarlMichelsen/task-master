import { io, Socket } from "socket.io-client";
import { host } from "../util/host";
import type { IServerToClientEvents } from "data-transfer-interfaces/websocket/serverToClientEvents";
import type { IClientToServerEvents } from "data-transfer-interfaces/websocket/clientToServerEvents";
import type { ClientUser } from "data-transfer-interfaces/user/clientUser";
import type { ClientPanel } from "data-transfer-interfaces/panel/clientPanel";
import type { ClientCard } from "data-transfer-interfaces/card/clientCard";

export class WebsocketService {
	private static socket: Socket<
		IServerToClientEvents,
		IClientToServerEvents
	> | null = null;
	static ready: boolean = false;

	static onConnect: (() => void) | null = null;
	static onDisconnect: (() => void) | null = null;

	static onUpdateConnected: ((connected: ClientUser[]) => void) | null = null;
	static onConnectedJoin: ((connected: ClientUser) => void) | null = null;
	static onConnectedLeave: ((connected: ClientUser) => void) | null = null;

	static onCreateTaskboardPanel: ((panel: ClientPanel) => void) | null = null;
	static onDeleteTaskboardPanel: ((panel: ClientPanel) => void) | null = null;
	static onMoveTaskboardPanel: ((panel: ClientPanel) => void) | null = null;

	static onCreateCard: ((card: ClientCard) => void) | null = null;
	static onMoveCard:
		| ((card: ClientCard, from: string, to: string) => void)
		| null = null;
	static onDeleteCard: ((card: ClientCard) => void) | null = null;

	static createTaskboardPanel(title: string, sortOrder: number) {
		if (!this.ready) throw new Error("No active websocket connection!");
		this.socket?.emit("createTaskboardPanel", title, sortOrder);
	}

	static deleteTaskboardPanel(panelId: string) {
		if (!this.ready) throw new Error("No active websocket connection!");
		this.socket?.emit("deleteTaskboardPanel", panelId);
	}

	static moveTaskboardPanel(panelId: string, sortOrder: number) {
		if (!this.ready) throw new Error("No active websocket connection!");
		this.socket?.emit("moveTaskboardPanel", panelId, sortOrder);
	}

	static createCard(panelId: string, title: string) {
		if (!this.ready) throw new Error("No active websocket connection!");
		this.socket?.emit("createCard", panelId, title);
	}

	static moveCard(cardId: string, fromPanelId: string, toPanelId: string) {
		if (!this.ready) throw new Error("No active websocket connection!");
		this.socket?.emit("moveCard", cardId, fromPanelId, toPanelId);
	}

	static deleteCard(cardId: string) {
		if (!this.ready) throw new Error("No active websocket connection!");
		this.socket?.emit("deleteCard", cardId);
	}

	static connect(jwt: string, taskboardUri: string) {
		// disconnect if already connected
		this.disconnect();

		const hostname = host();
		this.socket = io(hostname, {
			auth: { jwt, uri: taskboardUri },
			path: "/socket",
		});
		this.ready = true;

		this.socket.on("connect", () => {
			console.log("connect");
			this.onConnect && this.onConnect();
		});

		this.socket.on("createTaskboardPanel", (panel) => {
			console.log("createTaskboardPanel", panel);
			this.onCreateTaskboardPanel && this.onCreateTaskboardPanel(panel);
		});

		this.socket.on("deleteTaskboardPanel", (panel) => {
			console.log("deleteTaskboardPanel", panel);
			this.onDeleteTaskboardPanel && this.onDeleteTaskboardPanel(panel);
		});

		this.socket.on("moveTaskboardPanel", (panel) => {
			console.log("moveTaskboardPanel", panel);
			this.onMoveTaskboardPanel && this.onMoveTaskboardPanel(panel);
		});

		this.socket.on("createCard", (card) => {
			console.log("createCard", card);
			this.onCreateCard && this.onCreateCard(card);
		});

		this.socket.on("moveCard", (card, from, to) => {
			console.log("moveCard", card);
			this.onMoveCard && this.onMoveCard(card, from, to);
		});

		this.socket.on("deleteCard", (card) => {
			console.log("deleteCard", card);
			this.onDeleteCard && this.onDeleteCard(card);
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
