import { UserRepository } from "../repositories/userRepository";

import { CardAttributes } from "../database/models/card";
import { UserAttributes } from "../database/models/user";

import { mapToClientUser } from "./clientUserMapper";

import { ClientCard } from "data-transfer-interfaces/card/clientCard";

export const mapToClientCard = async (
	card: CardAttributes,
	ownerInput?: UserAttributes
): Promise<ClientCard> => {
	let owner: UserAttributes | null = null;
	if (card.owner_id) {
		owner = ownerInput ?? null;
		if (!owner) {
			const userRepository = new UserRepository();
			owner = await userRepository.getUserById(card.owner_id);
		}
	}

	const clientCard: ClientCard = {
		id: card.id,
		title: card.title,
		panelId: card.panel_id,
		owner: owner ? await mapToClientUser(owner) : null,
	};

	return clientCard;
};
