import { ClientUser } from "../user/clientUser";

export interface IServerToClientEvents {
	updateConnected: (connected: ClientUser[]) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
}
