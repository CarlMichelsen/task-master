import { TaskboardAttributes } from "../database/models/taskboard";
import { UserAttributes } from "../database/models/user";

export class TaskboardLobby {
	taskboard: TaskboardAttributes;
	connected: UserAttributes[] = [];

	constructor(taskboard: TaskboardAttributes) {
		this.taskboard = taskboard;
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
