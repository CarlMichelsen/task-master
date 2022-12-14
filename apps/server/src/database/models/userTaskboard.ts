import { Sequelize, DataTypes, Model, ModelOptions } from "sequelize";
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
			references: {
				model: User,
			},
			primaryKey: true,
		},
		taskboard_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: Taskboard,
			},
			primaryKey: true,
		},
	},
	modelOptions
);

UserTaskboard.belongsTo(User, {
	foreignKey: "id",
	keyType: DataTypes.UUID,
});

UserTaskboard.belongsTo(Taskboard, {
	foreignKey: "id",
	keyType: DataTypes.UUID,
});

Taskboard.belongsToMany(User, {
	through: "UserTaskboard",
});

User.belongsToMany(Taskboard, {
	through: "UserTaskboard",
});

export { UserTaskboard };
