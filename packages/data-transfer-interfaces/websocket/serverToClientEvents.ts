import type { ClientCard } from "../card/clientCard";
import type { ClientPanel } from "../panel/clientPanel";
import type { ClientUser } from "../user/clientUser";

export interface IServerToClientEvents {
	updateConnected: (connected: ClientUser[]) => void;
	onConnectedJoin: (connected: ClientUser) => void;
	onConnectedLeave: (connected: ClientUser) => void;
	createTaskboardPanel: (panel: ClientPanel) => void;
	deleteTaskboardPanel: (panel: ClientPanel) => void;
	moveTaskboardPanel: (panel: ClientPanel) => void;
	createCard: (card: ClientCard) => void;
	moveCard: (card: ClientCard, from: string, to: string) => void;
	deleteCard: (card: ClientCard) => void;
}
