import { Sequelize, DataTypes, Model } from "sequelize";
import { Configuration } from "../../configuration";
import { Account } from "./account";
import { modelOptions } from "./schema";
const sequelize = new Sequelize(Configuration.databaseUrl);

export interface UserAttributes {
	id: string;
	account_id: string;
	username: string;
	image_seed: string;
	upvotes: number;
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
		image_seed: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		upvotes: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
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
