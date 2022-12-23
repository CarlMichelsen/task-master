import * as io from "socket.io";
import * as http from "http";
import * as cors from "cors";

import { leave } from "./routes/leave";

import { authenticateHandshake } from "./util/authenticateHandshake";

import { IInterServerEvents } from "./eventInterfaces/IInterServerEvents";
import { IClientToServerEvents } from "data-transfer-interfaces/websocket/clientToServerEvents";
import { IServerToClientEvents } from "data-transfer-interfaces/websocket/serverToClientEvents";
import { ISocketData } from "./eventInterfaces/ISocketData";

import { TaskboardRepository } from "../repositories/taskboardRepository";
import { TaskboardLobby } from "./taskboardLobby";
import { mapToManyClientUser } from "../mappers/clientUserMapper";

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
			const jwt: string = socket.handshake.auth.jwt;
			const taskboardUri: string = socket.handshake.auth.uri;
			const taskboard = await this.taskboardRepository.getTaskboardByUri(
				taskboardUri
			);
			const user = await authenticateHandshake(jwt);
			if (!user || !taskboard) {
				socket.disconnect();
				return;
			}
			socket.data.user = user;
			const exsisting = this.lobbies.get(taskboard.uri);
			const lobby = exsisting ? exsisting : new TaskboardLobby(taskboard);
			if (!exsisting) this.lobbies.set(taskboard.uri, lobby);
			await socket.join(taskboard.uri);
			lobby.add(user);
			this.io
				.to(taskboard.uri)
				.emit("updateConnected", mapToManyClientUser(lobby.connected));

			socket.on("disconnect", (reason) => {
				lobby.remove(user);
				this.io
					.to(taskboard.uri)
					.emit("updateConnected", mapToManyClientUser(lobby.connected));
				if (lobby.isEmpty()) this.lobbies.delete(taskboard.uri);
			});
		});
	}
}
