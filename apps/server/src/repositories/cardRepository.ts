import { Card, CardAttributes } from "../database/models/card";

export class CardRepository {
	async getCardsInPanel(panelId: string): Promise<CardAttributes[]> {
		const cardResults = await Card.findAll({
			where: {
				panel_id: panelId,
			},
		});
		return cardResults.map((card) => card.dataValues);
	}

	async getCard(cardId: string): Promise<CardAttributes | null> {
		const cardResult = await Card.findByPk(cardId);
		return cardResult?.dataValues ?? null;
	}

	async deleteCardsInPanel(panelId: string): Promise<number> {
		return await Card.destroy({
			where: {
				panel_id: panelId,
			},
		});
	}
}
