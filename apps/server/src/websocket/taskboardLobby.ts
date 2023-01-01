import { PanelAttributes } from "../database/models/panel";
import { TaskboardAttributes } from "../database/models/taskboard";
import { UserAttributes } from "../database/models/user";

import { PanelService } from "../services/panelService";
import { CardService } from "../services/cardService";

export class TaskboardLobby {
	taskboard: TaskboardAttributes;
	connected: UserAttributes[] = [];
	private readonly panelService = new PanelService();
	private readonly cardService = new CardService();

	constructor(taskboard: TaskboardAttributes) {
		this.taskboard = taskboard;
		console.log(
			"lobby for taskboard",
			`"${taskboard.taskboard_name}"`,
			"was created"
		);
	}

	private alreadyConnectedId(user: UserAttributes): number {
		return this.connected.findIndex((u) => u.id === user.id);
	}

	join(user: UserAttributes) {
		if (this.alreadyConnectedId(user) !== -1) return;
		const joinMsg = `"${user.username}" connected to taskboard "${this.taskboard.taskboard_name}"`;
		console.log(joinMsg);
		this.connected.push(user);
	}

	async createTaskboardPanel(
		title: string,
		sortOrder: number
	): Promise<PanelAttributes | null> {
		const newPanel = this.panelService.panelFactory(
			title,
			sortOrder,
			this.taskboard.id
		);
		return await this.panelService.createPanelForTaskboard(newPanel);
	}

	async deleteTaskboardPanel(panelId: string): Promise<PanelAttributes | null> {
		return await this.panelService.deletePanel(panelId);
	}

	async moveTaskboardPanel(
		panelId: string,
		sortOrder: number
	): Promise<PanelAttributes | null> {
		return await this.panelService.moveTaskboardPanel(panelId, sortOrder);
	}

	async createCard(title: string, panelId: string, ownerId: string) {
		return await this.cardService.createCard(title, panelId, ownerId);
	}

	async moveCard(cardId: string, from: string, to: string) {
		const isInFromPanel = await this.cardService.isCardInPanel(cardId, from);
		const sameTaskboard = await this.panelService.inSameTaskboard(from, to);
		if (!isInFromPanel || !sameTaskboard) return null;
		return await this.cardService.moveCard(cardId, to);
	}

	async deleteCard(cardId: string) {
		return await this.cardService.deleteCard(cardId);
	}

	isEmpty(): boolean {
		return this.connected.length === 0;
	}

	leave(user: UserAttributes) {
		const id = this.alreadyConnectedId(user);
		if (id === -1) return;
		const leaveMsg = `"${user.username}" disconnected from taskboard "${this.taskboard.taskboard_name}"`;
		console.log(leaveMsg);
		this.connected.splice(id, 1);
	}
}
