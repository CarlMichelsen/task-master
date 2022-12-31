import { ClientCard } from "data-transfer-interfaces/card/clientCard";
import { ClientPanel } from "data-transfer-interfaces/panel/clientPanel";

import { UserAttributes } from "../database/models/user";
import { PanelAttributes } from "../database/models/panel";

import { UserRepository } from "../repositories/userRepository";
import { CardRepository } from "../repositories/cardRepository";

import { mapToClientCard } from "./clientCardMapper";

export const mapToClientPanel = async (
	panel: PanelAttributes
): Promise<ClientPanel> => {
	const cardRepository = new CardRepository();
	const cards = await cardRepository.getCardsInPanel(panel.id);
	const cachedUsers = new Map<string, UserAttributes>();
	const userRepository = new UserRepository();

	const clientCards: ClientCard[] = [];
	for (let c of cards) {
		let user = c.owner_id ? cachedUsers.get(c.owner_id) : undefined;
		if (c.owner_id && !user) {
			user = (await userRepository.getUserById(c.owner_id)) ?? undefined;
			if (user) cachedUsers.set(user.id, user);
		}

		const clientCard = await mapToClientCard(c, user);
		clientCards.push(clientCard);
	}

	const clientPanel: ClientPanel = {
		id: panel.id,
		taskboardId: panel.taskboard_id,
		title: panel.title,
		sortOrder: panel.sort_order,
		cards: clientCards,
	};

	return clientPanel;
};

export const mapToManyClientPanel = async (
	panels: PanelAttributes[]
): Promise<ClientPanel[]> => {
	const promises = panels.map((p) => mapToClientPanel(p));
	return await Promise.all(promises);
};
