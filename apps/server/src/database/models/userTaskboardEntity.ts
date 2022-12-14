import { Sequelize, DataTypes } from "sequelize";
import { Configuration } from "../../configuration";
const sequelize = new Sequelize(Configuration.databaseUrl ?? ""); // TODO: change database type to string

// junction table
const UserTaskboardEntity = sequelize.define("UserTaskboardEntity", {
	user_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	taskboard_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
});

UserTaskboardEntity.belongsTo(sequelize.models.UserEntity, {
	foreignKey: "user_id",
});

UserTaskboardEntity.belongsTo(sequelize.models.TaskboardEntity, {
	foreignKey: "taskboard_id",
});

export { UserTaskboardEntity };
