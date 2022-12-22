export interface ServiceResponse<T> {
	ok: boolean;
	errors: string[];
	data?: T;
}
