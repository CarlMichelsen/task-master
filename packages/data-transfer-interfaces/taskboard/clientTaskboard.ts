import { ClientUser } from "../user/clientUser";
import { ClientPanel } from "../panel/clientPanel";

export interface ClientTaskboard {
	name: string;
	uri: string;
	backgroundUrl: string | null;
	owner: ClientUser;
	members: ClientUser[];
	panels: ClientPanel[];
}
