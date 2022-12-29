import crypto from "crypto";
import {
	PanelAttributes,
	PanelCreationAttributes,
} from "../database/models/panel";
import { PanelRepository } from "../repositories/panelRepository";
import { CardRepository } from "../repositories/cardRepository";

export class PanelService {
	private readonly repository = new PanelRepository();
	private readonly cardRepository = new CardRepository();

	public panelFactory(
		title: string,
		sortOrder: number,
		taskboardId: string
	): PanelAttributes {
		return {
			id: crypto.randomUUID(),
			taskboard_id: taskboardId,
			title: title,
			sort_order: sortOrder,
		};
	}

	public async createPanelForTaskboard(
		panel: PanelCreationAttributes
	): Promise<PanelAttributes | null> {
		return await this.repository.createPanelForTaskboard(panel);
	}

	public async getPanelsForTaskboard(
		taskboardId: string
	): Promise<PanelAttributes[]> {
		return await this.repository.getPanelsForTaskboard(taskboardId);
	}

	public async deletePanelsInTaskboard(taskboardId: string): Promise<number> {
		const panels = await this.repository.getPanelsForTaskboard(taskboardId);
		const panelIds = panels.map((p) => p.id);
		const rows = await this.cardRepository.deleteCardsInMultiplePanels(
			panelIds
		);
		return await this.repository.deletePanelsInTaskboard(taskboardId);
	}
}
