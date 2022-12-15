export interface AuthResponse {
	complete: boolean;
	errors: string[];
	jwt: string | null;
}
