import { ClientUser } from "../user/clientUser";

export interface ClientCard {
	id: string;
	panelId: string;
	owner: ClientUser | null;
	title: string;
	sortOrder: number;
}
