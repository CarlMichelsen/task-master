import { Taskboard, TaskboardAttributes } from "../database/models/taskboard";
import { User, UserAttributes } from "../database/models/user";
import {
	UserTaskboard,
	UserTaskboardAttributes,
} from "../database/models/userTaskboard";

export class TaskboardService {
	async getUserTaskboards(userId: string): Promise<TaskboardAttributes[]> {
		const res = await Taskboard.findAll({
			include: {
				model: UserTaskboard,
				as: "userTaskboardLink",
				where: {
					user_id: userId,
				},
				required: true,
			},
		});

		return res?.map((v) => v.dataValues) ?? [];
	}

	async getTaskBoardMembers(taskboardId: string): Promise<UserAttributes[]> {
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

	async getTaskBoard(taskboardId: string): Promise<TaskboardAttributes | null> {
		const res = await Taskboard.findByPk(taskboardId);
		return res?.dataValues ?? null;
	}

	async userIsMember(userId: string, taskboardId: string): Promise<boolean> {
		const res = await UserTaskboard.findOne({
			where: {
				user_id: userId,
				taskboard_id: taskboardId,
			},
		});
		return !!res?.dataValues;
	}

	async revokeTaskboardResponsibility(userId: string, taskboardId: string) {
		const taskboard = await this.getTaskBoard(taskboardId);
		if (!taskboard) return false;

		const members = await this.getTaskBoardMembers(taskboardId);
		if (!members.find((m) => m.id === userId)) return false;

		if (members.length === 1) {
			this.naiveLeaveTaskboard(userId, taskboardId);
		}

		if (taskboard.owner_id === userId) {
			let randomMember = userId;
			while (randomMember === userId)
				randomMember = members[Math.floor(Math.random() * members.length)].id;

			const rows = await Taskboard.update(
				{
					owner_id: randomMember,
				},
				{
					where: { id: taskboardId },
				}
			);

			return rows[0] > 0;
		}

		return false;
	}

	async joinTaskboard(userId: string, taskboardId: string): Promise<boolean> {
		const link: UserTaskboardAttributes = {
			user_id: userId,
			taskboard_id: taskboardId,
		};
		const res = await UserTaskboard.create(link);
		return !!res?.dataValues;
	}

	private async naiveLeaveTaskboard(userId: string, taskboardId: string) {
		const rows = await UserTaskboard.destroy({
			where: {
				user_id: userId,
				taskboard_id: taskboardId,
			},
		});
		return rows > 0;
	}

	async createUserTaskboard(
		ownerId: string,
		taskboardInput: TaskboardAttributes
	): Promise<TaskboardAttributes> {
		const taskboard: TaskboardAttributes = { ...taskboardInput };
		taskboard.owner_id = ownerId;

		const link: UserTaskboardAttributes = {
			user_id: ownerId,
			taskboard_id: taskboard.id,
		};

		try {
			await Taskboard.create(taskboard);
			try {
				await UserTaskboard.create(link);
			} catch (error) {
				throw new Error("Owner failed to join newly created Taskboard");
			}
		} catch (error) {
			await Taskboard.destroy({ where: { id: taskboard.id } });
			throw new Error("Failed to create new taskboard");
		}

		return taskboard;
	}
}
