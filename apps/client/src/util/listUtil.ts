import type { ClientPanel } from "data-transfer-interfaces/panel/clientPanel";
import type { ClientUser } from "data-transfer-interfaces/user/clientUser";

export const sortClientUserList = (
	clientId?: string
): ((u1: ClientUser, u2: ClientUser) => number) => {
	return (u1: ClientUser, u2: ClientUser): number => {
		let num = u1.username.localeCompare(u2.username);
		if (num === 0) num = u1.upvotes - u2.upvotes;
		return (
			numericalClientUser(u1, clientId) - numericalClientUser(u2, clientId)
		);
	};
};

export const mergeLists = (
	baseList: { id: string }[],
	priorityList: { id: string }[]
) => {
	const panelMap = new Map<string, { id: string }>();
	baseList.forEach((u) => panelMap.set(u.id, u));
	priorityList.forEach((u) => panelMap.set(u.id, u));
	return Array.from(panelMap.values());
};

export const numericalClientUser = (
	u: ClientUser,
	clientId?: string
): number => {
	let num = u.online ? 1000 : 0;
	num += clientId === u.id ? 1000 : 0;
	return num;
};
