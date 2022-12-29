export interface IClientToServerEvents {
	createTaskboardPanel: (title: string, sortOrder: number) => void;
	deleteTaskboardPanel: (panelId: string) => void;
}
