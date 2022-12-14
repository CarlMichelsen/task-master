import { config } from "dotenv";

export class Configuration {
	static init() {
		config();
	}

	static get databaseUrl(): string | undefined {
		return process.env.DATABASE_URL;
	}

	static get port(): number {
		return isNaN(Number(process.env.PORT)) ? 80 : Number(process.env.PORT);
	}
}
