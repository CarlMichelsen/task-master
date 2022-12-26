import { Sequelize, DataTypes, Model } from "sequelize";
import { Configuration } from "../../configuration";
import { User } from "./user";
import { modelOptions } from "./schema";
const sequelize = new Sequelize(Configuration.databaseUrl);

export interface TaskboardAttributes {
	id: string;
	organisation_id: string | null;
	uri: string;
	background_url: string | null;
	taskboard_name: string;
	owner_id: string;
}

export interface TaskboardCreationAttributes extends TaskboardAttributes {}

const Taskboard = sequelize.define<
	Model<TaskboardAttributes, TaskboardCreationAttributes>
>(
	"Taskboard",
	{
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
		},
		organisation_id: {
			type: DataTypes.UUID,
			allowNull: true,
		},
		uri: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		background_url: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		taskboard_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		owner_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: User,
			},
		},
	},
	modelOptions
);

export { Taskboard };
