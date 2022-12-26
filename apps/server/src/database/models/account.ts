import { Sequelize, DataTypes, Model } from "sequelize";
import { Configuration } from "../../configuration";
import { modelOptions } from "./schema";
const sequelize = new Sequelize(Configuration.databaseUrl);

export interface AccountAttributes {
	id: string;
	fullname: string;
	email: string;
	passwordHash: string;
	passwordSalt: string;
	email_verified: boolean;
}

export interface AccountCreationAttributes extends AccountAttributes {}

const Account = sequelize.define<
	Model<AccountAttributes, AccountCreationAttributes>
>(
	"Account",
	{
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
		passwordHash: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		passwordSalt: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email_verified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
	},
	modelOptions
);

export { Account };
