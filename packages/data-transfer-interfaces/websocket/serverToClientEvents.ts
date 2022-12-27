import type { ClientUser } from "../user/clientUser";

export interface IServerToClientEvents {
	updateConnected: (connected: ClientUser[]) => void;
	onConnectedJoin: (connected: ClientUser) => void;
	onConnectedLeave: (connected: ClientUser) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
}
