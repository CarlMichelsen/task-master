import {
	Card,
	CardAttributes,
	CardCreationAttributes,
} from "../database/models/card";

export class CardRepository {
	async getCardsInPanel(panelId: string): Promise<CardAttributes[]> {
		const cardResults = await Card.findAll({
			where: {
				panel_id: panelId,
			},
		});
		return cardResults.map((card) => card.dataValues);
	}

	async createCard(
		card: CardCreationAttributes
	): Promise<CardAttributes | null> {
		try {
			const cardResult = await Card.create(card);
			return cardResult.dataValues;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async getCard(cardId: string): Promise<CardAttributes | null> {
		const cardResult = await Card.findByPk(cardId);
		return cardResult?.dataValues ?? null;
	}

	async deleteCard(cardId: string): Promise<CardAttributes | null> {
		const card = await this.getCard(cardId);
		const rows = await Card.destroy({
			where: { id: cardId },
		});
		return rows > 0 ? card : null;
	}

	async moveCard(cardId: string, toPanelId: string): Promise<boolean> {
		try {
			const rows = await Card.update(
				{
					panel_id: toPanelId,
				},
				{
					where: { id: cardId },
				}
			);
			return rows[0] > 0;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async deleteCardsInPanel(panelId: string): Promise<number> {
		return await Card.destroy({
			where: {
				panel_id: panelId,
			},
		});
	}

	async deleteCardsInMultiplePanels(panelIds: string[]): Promise<number> {
		return await Card.destroy({
			where: {
				panel_id: panelIds,
			},
		});
	}
}
