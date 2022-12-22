import { ValidationResult } from "./authValidationService";

export class TaskboardValidationService {
	public attemptFixTaskboardName(taskboardName?: string): string | null {
		if (!taskboardName) return null;
		const fixed = taskboardName[0].toUpperCase() + taskboardName.substring(1);
		return fixed.trim();
	}

	public validateTaskboardName(taskboardName: string): ValidationResult {
		const res = new ValidationResult();

		if (!taskboardName) {
			res.errors.push("No name");
			return res;
		}

		if (taskboardName.length <= 3) {
			res.errors.push("Taskboard names need to be 3 characters or more");
			return res;
		}

		if (taskboardName.length >= 32) {
			res.errors.push("Taskboard names can't be longer than 32 characters");
			return res;
		}

		if (!/[a-zA-Z]/.test(taskboardName[0])) {
			res.errors.push("Taskboard names can't start with special characers");
			return res;
		}

		if (taskboardName[0] !== taskboardName[0].toUpperCase()) {
			res.errors.push("Taskboard names have to start with a capital letter");
			return res;
		}

		return res;
	}
}
