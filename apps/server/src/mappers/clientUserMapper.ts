import { ClientUser } from "data-transfer-interfaces/user/clientUser";
import { UserAttributes } from "../database/models/user";

export const mapToClientUser = (
	input: UserAttributes,
	online: boolean = false
): ClientUser => {
	return {
		id: input.id,
		username: input.username,
		imageSeed: input.image_seed,
		online: online,
	};
};

export const mapToManyClientUser = (input: UserAttributes[]): ClientUser[] => {
	return input.map((u) => mapToClientUser(u));
};
