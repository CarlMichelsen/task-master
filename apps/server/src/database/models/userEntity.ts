import { Sequelize, DataTypes } from "sequelize";
import { Configuration } from "../../configuration";
import { AccountEntity } from "./accountEntity";
const sequelize = new Sequelize(Configuration.databaseUrl ?? ""); // TODO: change database type to string

const UserEntity = sequelize.define("UserEntity", {
	id: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true,
	},
	account_id: {
		type: DataTypes.UUID,
		unique: true,
		allowNull: false,
		references: {
			model: AccountEntity,
		},
	},
	username: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
	online: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
});

UserEntity.belongsTo(AccountEntity, {
	foreignKey: "id",
	keyType: DataTypes.UUID,
});

export { UserEntity };
