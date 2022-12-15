import { Sequelize, DataTypes, Model, ModelOptions } from "sequelize";
import { Configuration } from "../../configuration";
import { Account } from "./account";
const sequelize = new Sequelize(Configuration.databaseUrl);

const modelOptions: ModelOptions = {
	schema: "task",
};

export interface UserAttributes {
	id: string;
	account_id: string;
	username: string;
	online: boolean;
}

export interface UserCreationAttributes extends UserAttributes {}

const User = sequelize.define<Model<UserAttributes, UserCreationAttributes>>(
	"User",
	{
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
				model: Account,
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
	},
	modelOptions
);

User.belongsTo(Account, {
	foreignKey: "account_id",
	keyType: DataTypes.UUID,
});

export { User };