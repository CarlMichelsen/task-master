import { Sequelize, SyncOptions } from "sequelize";
import { Configuration } from "../configuration";
import { Account } from "./models/account";
import { Taskboard } from "./models/taskboard";
import { User } from "./models/user";
import { UserTaskboard } from "./models/userTaskboard";

const dblog: (sql: string, timing?: number) => void = (
	sql: string,
	timing?: number
) => {
	console.log("SQL", `"${sql}"`, timing != null ? `${timing} ms` : undefined);
};

const getAllSchemas = async (sql: Sequelize): Promise<string[]> => {
	const rs: any = await sql.showAllSchemas({});
	const schemas = rs as string[];
	return schemas;
};

export const syncDb = async (callback: () => void, skip: boolean = false) => {
	if (skip) {
		callback();
		return;
	}

	const options: SyncOptions = { force: false, alter: { drop: false } };
	const sequelize = new Sequelize(Configuration.databaseUrl);

	const schemas = await getAllSchemas(sequelize);
	if (!schemas.includes("task")) {
		await sequelize.createSchema("task", {
			logging: dblog,
			benchmark: true,
		});
		console.log("task", "created schema");
	}

	await Account.sync(options);
	console.log("Account", "synced");

	await User.sync(options);
	console.log("User", "synced");

	await Taskboard.sync(options);
	console.log("Taskboard", "synced");

	await UserTaskboard.sync(options);
	console.log("UserTaskboard", "synced");

	console.log("Sync complete!");
	callback();
};
