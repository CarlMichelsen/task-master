import { Taskboard, TaskboardAttributes } from "../database/models/taskboard";
import { User, UserAttributes } from "../database/models/user";
import { UserTaskboard } from "../database/models/userTaskboard";

export class TaskboardRepository {
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

	public async joinTaskboard(
		taskboardId: string,
		userId: string
	): Promise<boolean> {
		const user = await User.findByPk(userId);
		if (!user) return false;

		const taskboard = await Taskboard.findByPk(taskboardId);
		if (!taskboard) return false;

		try {
			await UserTaskboard.create({
				taskboard_id: taskboard.dataValues.id,
				user_id: user.dataValues.id,
			});
			return true;
		} catch (error) {
			return false;
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
		const res = await User.findAll({
			include: {
				model: UserTaskboard,
				as: "members",
				where: {
					taskboard_id: taskboardId,
				},
				required: true,
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
