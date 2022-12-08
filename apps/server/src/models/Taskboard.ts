export class Taskboard {
	id: string;
	uri: string;
	name: string;
	ownerId: string;

	constructor(id: string, uri: string, name: string, ownerId: string) {
		this.id = id;
		this.uri = uri;
		this.name = name;
		this.ownerId = ownerId;
	}
}
