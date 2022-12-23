import { ClientUser } from "data-transfer-interfaces/user/clientUser";
import { UserAttributes } from "../database/models/user";

export const mapToClientUser = (input: UserAttributes): ClientUser => {
	return {
		username: input.username,
		imageSeed: input.image_seed,
		online: input.online,
	};
};

export const mapToManyClientUser = (input: UserAttributes[]): ClientUser[] => {
	return input.map((u) => mapToClientUser(u));
};
