import { config } from "dotenv";

export class Configuration {
	static init() {
		config();
	}

	static get databaseUrl(): string {
		if (!process.env.DATABASE_URL) throw new Error("No DATABASE_URL");
		return process.env.DATABASE_URL;
	}

	static get production(): boolean {
		return process.env.NODE_ENV === "production" ? true : false;
	}

	static get port(): number {
		return isNaN(Number(process.env.PORT)) ? 80 : Number(process.env.PORT);
	}

	static get authorizationSecret(): string {
		if (!process.env.AUTHORIZATION_SECRET)
			throw new Error("No AUTHORIZATION_SECRET");
		return process.env.AUTHORIZATION_SECRET;
	}
}
