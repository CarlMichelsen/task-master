import { Taskboard, TaskboardAttributes } from "../database/models/taskboard";
import { User, UserAttributes } from "../database/models/user";
import { UserTaskboard } from "../database/models/userTaskboard";

import { CardRepository } from "./cardRepository";
import { PanelRepository } from "./panelRepository";

export class TaskboardRepository {
	private readonly panelRepository = new PanelRepository();
	private readonly cardRepository = new CardRepository();

	public async createTaskboard(
		userId: string,
		taskboardInput: TaskboardAttributes
	): Promise<TaskboardAttributes | null> {
		const user = await User.findByPk(userId);
		if (!user) return null;
		try {
			const taskboard = await Taskboard.create({
				...taskboardInput,
				owner_id: user.dataValues.id,
			});
			await UserTaskboard.create({
				user_id: user.dataValues.id,
				taskboard_id: taskboard.dataValues.id,
			});
			return taskboard.dataValues;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	public async getTaskboard(
		taskboardId: string
	): Promise<TaskboardAttributes | null> {
		const taskboard = await Taskboard.findByPk(taskboardId);
		return taskboard?.dataValues ?? null;
	}

	public async getTaskboardByUri(
		taskboardUri: string
	): Promise<TaskboardAttributes | null> {
		const taskboard = await Taskboard.findOne({
			where: { uri: taskboardUri },
		});
		return taskboard?.dataValues ?? null;
	}

	public async naiveJoinTaskboard(
		taskboardId: string,
		userId: string
	): Promise<boolean> {
		try {
			await UserTaskboard.create({
				taskboard_id: taskboardId,
				user_id: userId,
			});
			return true;
		} catch (error: any) {
			if (error["name"] === "SequelizeUniqueConstraintError") return true; // user already joined
			return false;
		}
	}

	public async joinTaskboard(
		taskboardId: string,
		userId: string
	): Promise<TaskboardAttributes | null> {
		const user = await User.findByPk(userId);
		if (!user) return null;

		const taskboard = await Taskboard.findByPk(taskboardId);
		if (!taskboard?.dataValues) return null;

		try {
			await UserTaskboard.create({
				taskboard_id: taskboard.dataValues.id,
				user_id: user.dataValues.id,
			});
			return taskboard.dataValues ?? null;
		} catch (error: any) {
			if (error["name"] === "SequelizeUniqueConstraintError")
				return taskboard?.dataValues ?? null; // user already joined

			return null;
		}
	}

	public async leaveTaskboard(
		taskboardId: string,
		userId: string
	): Promise<boolean> {
		const user = await User.findByPk(userId);
		if (!user) return false;

		const taskboard = await Taskboard.findByPk(taskboardId);
		if (!taskboard) return false;

		const rows = await UserTaskboard.destroy({
			where: {
				taskboard_id: taskboardId,
				user_id: userId,
			},
		});

		return rows > 0;
	}

	public async deleteTaskboard(taskboardId: string): Promise<boolean> {
		const taskboard = await Taskboard.findByPk(taskboardId);
		if (!taskboard) return false;

		try {
			await UserTaskboard.destroy({
				where: {
					taskboard_id: taskboardId,
				},
			});
		} catch (error) {
			return false;
		}

		const panels = await this.panelRepository.getPanelsForTaskboard(
			taskboardId
		);
		const cardDeletePromises: Promise<number>[] = [];
		for (let p of panels) {
			cardDeletePromises.push(this.cardRepository.deleteCardsInPanel(p.id));
		}
		await Promise.all(cardDeletePromises);
		await this.panelRepository.deletePanelsInTaskboard(taskboardId);

		const rows = await Taskboard.destroy({
			where: {
				id: taskboardId,
			},
		});

		return rows > 0;
	}

	public async getUserTaskboards(
		userId: string
	): Promise<TaskboardAttributes[]> {
		const linksRes = await UserTaskboard.findAll({
			where: {
				user_id: userId,
			},
		});
		const links = linksRes.map((r) => r.dataValues.taskboard_id);

		const res = await Taskboard.findAll({
			where: {
				id: links,
			},
		});

		return res?.map((v) => v.dataValues) ?? [];
	}

	public async getTaskBoardMembers(
		taskboardId: string
	): Promise<UserAttributes[]> {
		const memberLinks = await UserTaskboard.findAll({
			where: { taskboard_id: taskboardId },
		});

		const ids = memberLinks.map((l) => l.dataValues.user_id);

		const res = await User.findAll({
			where: {
				id: ids,
			},
		});

		return res?.map((v) => v.dataValues) ?? [];
	}

	public async setNewTaskboardOwner(
		taskboardId: string,
		newOwnerUserId: string
	): Promise<boolean> {
		const taskboard = await Taskboard.findByPk(taskboardId);
		if (!taskboard) return false;

		const members = await this.getTaskBoardMembers(taskboardId);
		if (!members.find((m) => m.id === newOwnerUserId)) return false;

		const rows = await Taskboard.update(
			{
				owner_id: newOwnerUserId,
			},
			{
				where: { id: taskboardId },
			}
		);

		return rows[0] > 0;
	}
}
