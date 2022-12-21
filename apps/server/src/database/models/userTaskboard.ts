import {
	Sequelize,
	DataTypes,
	Model,
	ModelOptions,
	ThroughOptions,
	ModelAttributeColumnReferencesOptions,
} from "sequelize";
import { Configuration } from "../../configuration";
import { Taskboard } from "./taskboard";
import { User } from "./user";
const sequelize = new Sequelize(Configuration.databaseUrl);

const modelOptions: ModelOptions = {
	schema: "task",
};

export interface UserTaskboardAttributes {
	user_id: string;
	taskboard_id: string;
}

export interface UserTaskboardCreationAttributes
	extends UserTaskboardAttributes {}

// junction table
const UserTaskboard = sequelize.define<
	Model<UserTaskboardAttributes, UserTaskboardCreationAttributes>
>(
	"UserTaskboard",
	{
		user_id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			references: {
				model: User,
				key: "id",
			},
		},
		taskboard_id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			references: {
				model: Taskboard,
				key: "id",
			},
		},
	},
	modelOptions
);

export { UserTaskboard };
