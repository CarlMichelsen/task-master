export class ServiceResponse<T> {
	public ok: boolean = false;
	public errors: string[] = [];
	public data: T | null = null;
	public readonly created: number = Date.now();
}
