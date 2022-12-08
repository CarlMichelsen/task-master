export class Taskboard {
	id: string;
	name: string;
	ownerId: string;
	members: string[];

	constructor(id: string, name: string, ownerId: string) {
		this.id = id;
		this.name = name;
		this.ownerId = ownerId;
		this.members = [ownerId];
	}
}
