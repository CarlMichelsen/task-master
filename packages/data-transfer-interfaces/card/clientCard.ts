import { ClientPanel } from "../panel/clientPanel";
import { ClientUser } from "../user/clientUser";

export interface ClientCard {
	id: string;
	panel: ClientPanel;
	owner: ClientUser | null;
	title: string;
}
