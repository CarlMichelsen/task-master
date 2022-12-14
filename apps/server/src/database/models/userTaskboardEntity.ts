import { Sequelize, DataTypes } from "sequelize";
import { Configuration } from "../../configuration";
import { TaskboardEntity } from "./taskboardEntity";
import { UserEntity } from "./userEntity";
const sequelize = new Sequelize(Configuration.databaseUrl ?? ""); // TODO: change database type to string

// junction table
const UserTaskboardEntity = sequelize.define("UserTaskboardEntity", {
	user_id: {
		type: DataTypes.UUID,
		allowNull: false,
		references: {
			model: UserEntity,
		},
		primaryKey: true,
	},
	taskboard_id: {
		type: DataTypes.UUID,
		allowNull: false,
		references: {
			model: TaskboardEntity,
		},
		primaryKey: true,
	},
});

UserTaskboardEntity.belongsTo(UserEntity, {
	foreignKey: "id",
	keyType: DataTypes.UUID,
});

UserTaskboardEntity.belongsTo(TaskboardEntity, {
	foreignKey: "id",
	keyType: DataTypes.UUID,
});

TaskboardEntity.belongsToMany(UserEntity, {
	through: "UserTaskboardEntity",
});

UserEntity.belongsToMany(TaskboardEntity, {
	through: "UserTaskboardEntity",
});

export { UserTaskboardEntity };
