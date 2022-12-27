import crypto from "crypto";
import {
	Panel,
	PanelAttributes,
	PanelCreationAttributes,
} from "../database/models/panel";
import { TaskboardService } from "../services/taskboardService";

export class PanelRepository {
	async getPanelById(id: string): Promise<PanelAttributes | null> {
		const panelResponse = await Panel.findByPk(id);
		return panelResponse?.dataValues ?? null;
	}

	async getPanelsForTaskboard(taskboardId: string): Promise<PanelAttributes[]> {
		const panelResponse = await Panel.findAll({
			where: {
				taskboard_id: taskboardId,
			},
		});
		return panelResponse.map((panel) => panel.dataValues);
	}

	async getPanelsForTaskboardByUri(
		taskboardUri: string
	): Promise<PanelAttributes[]> {
		const taskboardService = new TaskboardService();
		const taskboard = await taskboardService.getTaskboardByUri(taskboardUri);

		if (!taskboard)
			throw new Error(`Could not find taskboard for uri <${taskboardUri}>`);

		return await this.getPanelsForTaskboard(taskboard.id);
	}

	panelFactory(
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

	async createPanelForTaskboard(
		panel: PanelCreationAttributes
	): Promise<PanelAttributes | null> {
		try {
			const createdPanel = await Panel.create(panel);
			return createdPanel.dataValues;
		} catch (error) {
			console.log(error);
			return null;
		}
	}
}
