export class User {
	id: string;
	username: string;
	taskboardId: string | null;
	online: boolean;

	constructor(id: string, username: string) {
		this.id = id;
		this.username = username;
		this.taskboardId = null;
		this.online = false;
	}
}
