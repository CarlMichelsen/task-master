import { AccountEntity } from "./models/accountEntity";
import { TaskboardEntity } from "./models/taskboardEntity";
import { UserEntity } from "./models/userEntity";
import { UserTaskboardEntity } from "./models/userTaskboardEntity";

export const syncDb = async (callback: () => void) => {
	await AccountEntity.sync();
	console.log("AccountEntity", "synced");

	await UserEntity.sync();
	console.log("UserEntity", "synced");

	await TaskboardEntity.sync();
	console.log("TaskboardEntity", "synced");

	await UserTaskboardEntity.sync();
	console.log("UserTaskboardEntity", "synced");

	console.log("Sync complete!");
	callback();
};
