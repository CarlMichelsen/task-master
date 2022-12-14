import { Sequelize, DataTypes } from "sequelize";
import { Configuration } from "../../configuration";
const sequelize = new Sequelize(Configuration.databaseUrl ?? ""); // TODO: change database type to string

const TaskboardEntity = sequelize.define("TaskboardEntity", {
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
	},
});

TaskboardEntity.belongsTo(sequelize.models.UserEntity, {
	foreignKey: "owner_id",
});

TaskboardEntity.belongsToMany(sequelize.models.UserEntity, {
	through: "UserTaskboardEntity",
});

export { TaskboardEntity };
