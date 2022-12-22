import * as io from "socket.io";
import { IClientToServerEvents } from "data-transfer-interfaces/websocket/clientToServerEvents";
import { IServerToClientEvents } from "data-transfer-interfaces/websocket/serverToClientEvents";
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
