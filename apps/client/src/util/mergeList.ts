import type { ClientUser } from "data-transfer-interfaces/user/clientUser";

export const mergeClientUserLists = (
	baseList: ClientUser[],
	priorityList: ClientUser[]
) => {
	const clientMap = new Map<string, ClientUser>();
	baseList.forEach((u) => clientMap.set(u.id, u));
	priorityList.forEach((u) => clientMap.set(u.id, u));
	return Array.from(clientMap.values());
};
