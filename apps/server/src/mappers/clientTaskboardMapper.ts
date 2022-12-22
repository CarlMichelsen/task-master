import { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";
import { Taskboard, TaskboardAttributes } from "../database/models/taskboard";
import { UserRepository } from "../repositories/userRepository";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export const mapToClientTaskboard = async (
	input: TaskboardAttributes
): Promise<ClientTaskboard> => {
	const userRepository = new UserRepository();
	const owner = await userRepository.getUserById(input.owner_id);
	if (!owner) throw new Error(`Found taskboard without owner <${input.id}>`);

	return {
		name: input.taskboard_name,
		uri: input.uri,
		backgroundUrl: input.background_url,
		ownerUsername: owner.username,
	};
};

export const mapManyToClientTaskboards = async (
	input: TaskboardAttributes[]
): Promise<ClientTaskboard[]> => {
	const promises: Promise<ClientTaskboard>[] = input.map((i) =>
		mapToClientTaskboard(i)
	);
	return await Promise.all(promises);
};

const generateUri = () => {
	return crypto
		.randomBytes(16)
		.toString("base64")
		.replace(/[^a-zA-Z0-9-_]/g, "");
};

export const uniqueUriGenerator = async (
	length: number = 6
): Promise<string> => {
	const valid = async (uri: string): Promise<boolean> => {
		const exsists = await Taskboard.findOne({ where: { uri } });
		return !exsists;
	};

	let randomString = generateUri();
	let uri = randomString.substring(0, length);
	while (!(await valid(uri))) {
		randomString = generateUri();
		uri = randomString.substring(0, length);
	}

	return uri;
};

export const taskboardFactory = async (
	ownerId: string,
	name: string
): Promise<TaskboardAttributes> => {
	return {
		id: uuidv4(),
		organisation_id: null,
		uri: await uniqueUriGenerator(),
		background_url: null,
		taskboard_name: name,
		owner_id: ownerId,
	};
};
