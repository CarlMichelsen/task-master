import { Sequelize, DataTypes, BelongsToOptions } from "sequelize";
import { Configuration } from "../../configuration";
import { UserEntity } from "./userEntity";
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
		references: {
			model: UserEntity,
		},
	},
});

TaskboardEntity.belongsTo(UserEntity, {
	foreignKey: "id",
	keyType: DataTypes.UUID,
});

export { TaskboardEntity };
