import { ClientIdentity } from "./clientIdentity";

export class AuthRequest {
	identity: ClientIdentity;

	constructor(identity: ClientIdentity) {
		this.identity = identity;
	}
}
