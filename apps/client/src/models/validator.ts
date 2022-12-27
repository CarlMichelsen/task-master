export interface Validator {
	[name: string]: (text: string) => boolean;
}
