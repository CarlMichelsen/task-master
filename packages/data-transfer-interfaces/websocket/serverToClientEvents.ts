import type { ClientPanel } from "../panel/clientPanel";
import type { ClientUser } from "../user/clientUser";

export interface IServerToClientEvents {
	updateConnected: (connected: ClientUser[]) => void;
	onConnectedJoin: (connected: ClientUser) => void;
	onConnectedLeave: (connected: ClientUser) => void;
	createTaskboardPanel: (panel: ClientPanel) => void;
	deleteTaskboardPanel: (panel: ClientPanel) => void;
	moveTaskboardPanel: (panel: ClientPanel) => void;
}
