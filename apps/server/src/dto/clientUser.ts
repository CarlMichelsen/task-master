export class ClientUser {
	id: string | null = null;
	username: string;

	constructor(username: string) {
		this.username = username;
	}
}
