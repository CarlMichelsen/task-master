import { Sequelize, DataTypes, Model } from "sequelize";
import { modelOptions } from "./schema";
import { Configuration } from "../../configuration";
import { Taskboard } from "./taskboard";
const sequelize = new Sequelize(Configuration.databaseUrl);

export interface PanelAttributes {
	id: string;
	taskboard_id: string;
	title: string;
	sort_order: number;
}

export interface PanelCreationAttributes extends PanelAttributes {}

const Panel = sequelize.define<Model<PanelAttributes, PanelCreationAttributes>>(
	"Panel",
	{
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
		},
		taskboard_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: Taskboard,
			},
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		sort_order: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
	},
	modelOptions
);

export { Panel };
