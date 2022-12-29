import * as io from "socket.io";
import * as http from "http";
import * as cors from "cors";

import { IInterServerEvents } from "./eventInterfaces/IInterServerEvents";
import { IClientToServerEvents } from "data-transfer-interfaces/websocket/clientToServerEvents";
import { IServerToClientEvents } from "data-transfer-interfaces/websocket/serverToClientEvents";
import { ISocketData } from "./eventInterfaces/ISocketData";

import { AuthService } from "../services/authService";
import { TaskboardLobby } from "./taskboardLobby";
import { getUser, joinTaskboard } from "./validate";
import {
	mapToClientUser,
	mapToManyClientUser,
} from "../mappers/clientUserMapper";
import { delay } from "../delay";
import { PanelAttributes } from "../database/models/panel";
import { mapToClientPanel } from "../mappers/clientPanelMapper";

export class WebSocketHandler {
	lobbies: Map<string, TaskboardLobby>;
	io: io.Server<
		IClientToServerEvents,
		IServerToClientEvents,
		IInterServerEvents,
		ISocketData
	>;

	constructor(httpServer: http.Server, cors?: cors.CorsOptions) {
		this.lobbies = new Map<string, TaskboardLobby>();
		this.io = new io.Server(httpServer, {
			path: "/socket",
			cors,
		});
	}

	async start(): Promise<void> {
		this.io.on("connection", async (socket) => {
			const claims = AuthService.authenticate(socket.handshake.auth.jwt);
			const uri: string = socket.handshake.auth.uri;

			const userPromise = getUser(claims);
			const taskboardPromise = joinTaskboard(claims, uri);

			const user = await userPromise;
			if (!user) return socket.disconnect();

			const taskboard = await taskboardPromise;
			if (!taskboard) return socket.disconnect();

			let lobby = this.lobbies.get(uri) ?? null;
			if (!lobby) {
				lobby = new TaskboardLobby(taskboard);
				this.lobbies.set(uri, lobby);
			}

			socket.join(uri);
			lobby.join(user);

			// *excludingUser
			const initialConnected = lobby.connected.filter((u) => u.id !== user.id);
			if (initialConnected.length > 0) {
				console.log("updateConnected");
				socket.emit(
					"updateConnected",
					mapToManyClientUser(initialConnected, true)
				);
			}

			await delay(50);

			this.io.to(uri).emit("onConnectedJoin", mapToClientUser(user, true));

			socket.on(
				"createTaskboardPanel",
				async (title: string, sortOrder: number) => {
					const panel =
						(await lobby?.createTaskboardPanel(title, sortOrder)) ?? null;
					if (!panel) return;
					this.io
						.to(uri)
						.emit(
							"createTaskboardPanel",
							await mapToClientPanel(panel, lobby?.taskboard)
						);
				}
			);

			socket.on("moveTaskboardPanel", async (panelId, sortOrder) => {
				const deletedPanel =
					(await lobby?.moveTaskboardPanel(panelId, sortOrder)) ?? null;
				if (!deletedPanel) return;
				this.io
					.to(uri)
					.emit(
						"moveTaskboardPanel",
						await mapToClientPanel(deletedPanel, lobby?.taskboard)
					);
			});

			socket.on("deleteTaskboardPanel", async (panelId) => {
				const deletedPanel =
					(await lobby?.deleteTaskboardPanel(panelId)) ?? null;
				if (!deletedPanel) return;
				this.io
					.to(uri)
					.emit(
						"deleteTaskboardPanel",
						await mapToClientPanel(deletedPanel, lobby?.taskboard)
					);
			});

			socket.on("disconnect", () => {
				console.log(`disconnected ${user.username}`);
				if (!lobby) throw new Error("Lobby should exsist on disconnect");
				lobby.leave(user);
				this.io.to(uri).emit("onConnectedLeave", mapToClientUser(user, true));
				if (lobby.isEmpty() && lobby.taskboard.uri) {
					console.log(
						"lobby for taskboard",
						`"${lobby.taskboard.taskboard_name}"`,
						"was shut down"
					);
					this.lobbies.delete(lobby?.taskboard.uri);
				}
			});
		});
	}
}
