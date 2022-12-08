export interface IUriService {
	generateUniqueUri(seedString: string): Promise<string | null>;
}
