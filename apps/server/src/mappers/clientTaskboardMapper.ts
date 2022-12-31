import crypto from "crypto";

import { TaskboardAttributes } from "../database/models/taskboard";
import { PanelAttributes } from "../database/models/panel";

import { TaskboardRepository } from "../repositories/taskboardRepository";
import { PanelRepository } from "../repositories/panelRepository";
import { UserRepository } from "../repositories/userRepository";

import { mapToClientUser, mapToManyClientUser } from "./clientUserMapper";
import { mapToClientPanel } from "./clientPanelMapper";

import { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";
import { ClientPanel } from "data-transfer-interfaces/panel/clientPanel";

export const mapToClientTaskboard = async (
	input: TaskboardAttributes
): Promise<ClientTaskboard> => {
	const userRepository = new UserRepository();
	const owner = await userRepository.getUserById(input.owner_id);
	if (!owner) throw new Error(`Found taskboard without owner <${input.id}>`);

	const taskboardRepository = new TaskboardRepository();
	const members = await taskboardRepository.getTaskBoardMembers(input.id);

	const panelRepository = new PanelRepository();
	const panels: PanelAttributes[] = await panelRepository.getPanelsForTaskboard(
		input.id
	);

	const clientPanelPromises: Promise<ClientPanel>[] = [];
	for (let p of panels) {
		clientPanelPromises.push(mapToClientPanel(p));
	}

	const clientPanels = await Promise.all(clientPanelPromises);

	return {
		name: input.taskboard_name,
		uri: input.uri,
		backgroundUrl: input.background_url,
		owner: mapToClientUser(owner),
		members: mapToManyClientUser(members),
		panels: clientPanels,
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

export const generateRandomUrlSafeString = () => {
	return crypto
		.randomBytes(16)
		.toString("base64")
		.replace(/[^a-zA-Z0-9-_]/g, "");
};

export const uniqueUriGenerator = async (
	length: number = 6
): Promise<string> => {
	const taskboardRepository = new TaskboardRepository();
	const valid = async (uri: string): Promise<boolean> => {
		const exsists = await taskboardRepository.getTaskboardByUri(uri);
		return !exsists;
	};

	let randomString = generateRandomUrlSafeString();
	let uri = randomString.substring(0, length);
	while (!(await valid(uri))) {
		randomString = generateRandomUrlSafeString();
		uri = randomString.substring(0, length);
	}

	return uri;
};

export const taskboardFactory = async (
	ownerId: string,
	name: string
): Promise<TaskboardAttributes> => {
	return {
		id: crypto.randomUUID(),
		organisation_id: null,
		uri: await uniqueUriGenerator(),
		background_url: null,
		taskboard_name: name,
		owner_id: ownerId,
	};
};
