import type { ClientUser } from "../user/clientUser";
import type { ClientPanel } from "../panel/clientPanel";

export interface ClientTaskboard {
	name: string;
	uri: string;
	backgroundUrl: string | null;
	owner: ClientUser;
	members: ClientUser[];
	panels: ClientPanel[];
}
