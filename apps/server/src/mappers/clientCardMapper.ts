import { PanelRepository } from "../repositories/panelRepository";
import { UserRepository } from "../repositories/userRepository";

import { CardAttributes } from "../database/models/card";
import { PanelAttributes } from "../database/models/panel";
import { UserAttributes } from "../database/models/user";

import { mapToClientPanel } from "./clientPanelMapper";
import { mapToClientUser } from "./clientUserMapper";

import { ClientCard } from "data-transfer-interfaces/card/clientCard";

export const mapToClientCard = async (
	card: CardAttributes,
	panelInput?: PanelAttributes,
	ownerInput?: UserAttributes
): Promise<ClientCard> => {
	let panel: PanelAttributes | null = panelInput ?? null;
	if (!panel) {
		const panelRepository = new PanelRepository();
		panel = await panelRepository.getPanelById(card.panel_id);
		if (!panel) throw new Error(`Could not find panel for card <${card.id}>`);
	}

	let owner: UserAttributes | null = null;
	if (card.owner) {
		owner = ownerInput ?? null;
		if (!owner) {
			const userRepository = new UserRepository();
			owner = await userRepository.getUserById(card.owner);
		}
	}

	const clientCard: ClientCard = {
		id: card.id,
		title: card.title,
		panel: await mapToClientPanel(panel),
		owner: owner ? await mapToClientUser(owner) : null,
	};

	return clientCard;
};
