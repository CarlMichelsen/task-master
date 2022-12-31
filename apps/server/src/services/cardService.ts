import crypto from "crypto";
import {
	CardAttributes,
	CardCreationAttributes,
} from "../database/models/card";
import { CardRepository } from "../repositories/cardRepository";

export class CardService {
	private readonly cardRepository = new CardRepository();

	public cardFactory(
		title: string,
		panelId: string,
		ownerId?: string
	): CardCreationAttributes {
		return {
			id: crypto.randomUUID(),
			panel_id: panelId,
			title: title,
			owner_id: ownerId,
			sort_order: 1,
		};
	}

	public async createCard(
		title: string,
		panelId: string,
		ownerId?: string
	): Promise<CardAttributes | null> {
		const creationCard = this.cardFactory(title, panelId, ownerId);
		const card = await this.cardRepository.createCard(creationCard);
		return card;
	}

	public async isCardInPanel(
		cardId: string,
		panelId: string
	): Promise<boolean> {
		const card = await this.cardRepository.getCard(cardId);
		if (!card) return false;
		return card.panel_id === panelId;
	}

	public async moveCard(
		cardId: string,
		toPanelId: string
	): Promise<CardAttributes | null> {
		const moved = await this.cardRepository.moveCard(cardId, toPanelId);
		if (moved) return await this.cardRepository.getCard(cardId);
		return null;
	}

	public async deleteCard(cardId: string): Promise<CardAttributes | null> {
		return await this.cardRepository.deleteCard(cardId);
	}
}
