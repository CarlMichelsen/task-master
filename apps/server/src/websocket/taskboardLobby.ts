import { PanelAttributes } from "../database/models/panel";
import { TaskboardAttributes } from "../database/models/taskboard";
import { UserAttributes } from "../database/models/user";
import { PanelRepository } from "../repositories/panelRepository";

export class TaskboardLobby {
	taskboard: TaskboardAttributes;
	connected: UserAttributes[] = [];
	panelRepository: PanelRepository;

	constructor(taskboard: TaskboardAttributes) {
		this.taskboard = taskboard;
		this.panelRepository = new PanelRepository();
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
		const newPanel = this.panelRepository.panelFactory(
			title,
			sortOrder,
			this.taskboard.id
		);
		return await this.panelRepository.createPanelForTaskboard(newPanel);
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
