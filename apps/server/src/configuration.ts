import { config } from "dotenv";

export class Configuration {
	static initiated: boolean = false;

	static init() {
		if (!this.initiated) {
			config();
			this.initiated = true;
		}
	}

	static get databaseUrl(): string {
		this.init();
		if (!process.env.DATABASE_URL) throw new Error("No DATABASE_URL");
		return process.env.DATABASE_URL;
	}

	static get production(): boolean {
		this.init();
		return process.env.NODE_ENV === "production" ? true : false;
	}

	static get port(): number {
		this.init();
		return isNaN(Number(process.env.PORT)) ? 80 : Number(process.env.PORT);
	}

	static get authorizationSecret(): string {
		this.init();
		if (!process.env.AUTHORIZATION_SECRET)
			throw new Error("No AUTHORIZATION_SECRET");
		return process.env.AUTHORIZATION_SECRET;
	}
}
