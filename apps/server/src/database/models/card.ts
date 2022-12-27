import { Configuration } from "../../configuration";
import { Sequelize, DataTypes, Model } from "sequelize";
import { modelOptions } from "./schema";
import { Panel } from "./panel";
import { User } from "./user";
const sequelize = new Sequelize(Configuration.databaseUrl);

export interface CardAttributes {
	id: string;
	panel_id: string;
	title: string;
	owner?: string;
	sort_order: number;
}

export interface CardCreationAttributes extends CardAttributes {}

const Card = sequelize.define<Model<CardAttributes, CardCreationAttributes>>(
	"Card",
	{
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
		},
		panel_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: Panel,
			},
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		owner: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: User,
			},
		},
		sort_order: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
	},
	modelOptions
);

export { Card };
