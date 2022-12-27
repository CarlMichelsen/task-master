import type { Validator } from "../models/validator";

export const validatorResultObject = (
	input: Validator
): { [name: string]: boolean } => {
	const obj: { [name: string]: boolean } = {};
	Object.keys(input).forEach((k: string) => (obj[k] = false));
	return obj;
};
