import { JwtClaims } from "./src/services/authService";

declare global {
	namespace Express {
		export interface Request {
			claims: JwtClaims | null;
		}
	}
}
