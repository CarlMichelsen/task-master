import * as io from "socket.io";
import { IClientToServerEvents } from "models/websocket/clientToServerEvents";
import { IServerToClientEvents } from "models/websocket/serverToClientEvents";
import { IInterServerEvents } from "../eventInterfaces/IInterServerEvents";
import { ISocketData } from "../eventInterfaces/ISocketData";

export const join = (
	socket: io.Socket<
		IClientToServerEvents,
		IServerToClientEvents,
		IInterServerEvents,
		ISocketData
	>
) => {};
