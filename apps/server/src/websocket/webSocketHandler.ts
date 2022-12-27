import * as io from "socket.io";
import * as http from "http";
import * as cors from "cors";

import { IInterServerEvents } from "./eventInterfaces/IInterServerEvents";
import { IClientToServerEvents } from "data-transfer-interfaces/websocket/clientToServerEvents";
import { IServerToClientEvents } from "data-transfer-interfaces/websocket/serverToClientEvents";
import { ISocketData } from "./eventInterfaces/ISocketData";

import { AuthService } from "../services/authService";
import { TaskboardRepository } from "../repositories/taskboardRepository";
import { TaskboardLobby } from "./taskboardLobby";
import { getUser, joinTaskboard } from "./validate";
import {
	mapToClientUser,
	mapToManyClientUser,
} from "../mappers/clientUserMapper";
import { delay } from "../delay";

export class WebSocketHandler {
	lobbies: Map<string, TaskboardLobby>;
	taskboardRepository: TaskboardRepository;
	io: io.Server<
		IClientToServerEvents,
		IServerToClientEvents,
		IInterServerEvents,
		ISocketData
	>;

	constructor(httpServer: http.Server, cors?: cors.CorsOptions) {
		this.lobbies = new Map<string, TaskboardLobby>();
		this.taskboardRepository = new TaskboardRepository();
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

			socket.on("disconnect", () => {
				console.log(`disconnected ${user.username}`);
				if (!lobby) throw new Error("Lobby should exsist on disconnect");
				lobby.leave(user);
				this.io.to(uri).emit("onConnectedLeave", mapToClientUser(user, true));
				if (lobby.isEmpty() && lobby.taskboard.uri)
					this.lobbies.delete(lobby?.taskboard.uri);
			});
		});
	}
}
