import { TaskboardAttributes } from "../database/models/taskboard";
import { UserAttributes } from "../database/models/user";

export class TaskboardLobby {
	taskboard: TaskboardAttributes;

	constructor(taskboard: TaskboardAttributes) {
		this.taskboard = taskboard;
	}

	add(user: UserAttributes) {
		const joinMsg = `"${user.username}" connected to taskboard "${this.taskboard.taskboard_name}"`;
		console.log(joinMsg);
	}

	remove(user: UserAttributes) {
		const leaveMsg = `"${user.username}" disconnected from taskboard "${this.taskboard.taskboard_name}"`;
		console.log(leaveMsg);
	}
}
