import { Sequelize, DataTypes } from "sequelize";
import { Configuration } from "../../configuration";
const sequelize = new Sequelize(Configuration.databaseUrl ?? ""); // TODO: change database type to string

const AccountEntity = sequelize.define("AccountEntity", {
	id: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true,
	},
	fullname: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: DataTypes.STRING, // STORED AS HASH
		allowNull: false,
	},
	verified: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
});

export { AccountEntity };
