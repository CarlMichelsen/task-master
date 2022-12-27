import { ClientCard } from "data-transfer-interfaces/card/clientCard";
import { ClientPanel } from "data-transfer-interfaces/panel/clientPanel";

import { UserAttributes } from "../database/models/user";
import { PanelAttributes } from "../database/models/panel";
import { TaskboardAttributes } from "../database/models/taskboard";

import { UserRepository } from "../repositories/userRepository";
import { CardRepository } from "../repositories/cardRepository";
import { TaskboardRepository } from "../repositories/taskboardRepository";

import { mapToClientCard } from "./clientCardMapper";

export const mapToClientPanel = async (
	panel: PanelAttributes,
	taskboardInput?: TaskboardAttributes
): Promise<ClientPanel> => {
	let taskboard: TaskboardAttributes | null = taskboardInput ?? null;
	if (!taskboard) {
		const taskboardRepository = new TaskboardRepository();
		taskboard = await taskboardRepository.getTaskboard(panel.taskboard_id);
	}

	if (!taskboard)
		throw new Error(`Could not find taskboard for panel <${panel.id}>`);

	const cardRepository = new CardRepository();
	const cards = await cardRepository.getCardsInPanel(panel.id);
	const cachedUsers = new Map<string, UserAttributes>();
	const userRepository = new UserRepository();

	const clientCards: ClientCard[] = [];
	for (let c of cards) {
		let user = c.owner ? cachedUsers.get(c.owner) : undefined;
		if (c.owner && !user) {
			user = (await userRepository.getUserById(c.owner)) ?? undefined;
			if (user) cachedUsers.set(user.id, user);
		}

		const clientCard = await mapToClientCard(c, panel, user);
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
	panels: PanelAttributes[],
	taskboardInput?: TaskboardAttributes
): Promise<ClientPanel[]> => {
	const promises = panels.map((p) => mapToClientPanel(p, taskboardInput));
	return await Promise.all(promises);
};
