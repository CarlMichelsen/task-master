import { ITaskboardRepository } from "../repositories/ITaskboardRepository";
import { TaskboardRepository } from "../repositories/TaskboardRepository";
import { IUriService } from "./IUriService";

export class UriService implements IUriService {
	taskboardRepository: ITaskboardRepository;

	constructor() {
		this.taskboardRepository = new TaskboardRepository();
	}

	toShorterString(id: string) {
		const hexString = id.replace(/-/g, "");
		const base64String = Buffer.from(hexString, "hex").toString("base64");
		return base64String;
	}

	async generateUniqueUri(
		id: string,
		length: number = 6
	): Promise<string | null> {
		const shorter = this.toShorterString(id);
		for (let i = 0; i < shorter.length - length; i++) {
			const attempt = shorter.substring(i, i + length);
			const exists = await this.taskboardRepository.getByUri(attempt);
			if (!exists) return attempt;
		}
		return null;
	}
}
