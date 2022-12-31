export interface IClientToServerEvents {
	createTaskboardPanel: (title: string, sortOrder: number) => void;
	moveTaskboardPanel: (panelId: string, sortOrder: number) => void;
	deleteTaskboardPanel: (panelId: string) => void;
	createCard: (panelId: string, title: string) => void;
	moveCard: (cardId: string, from: string, to: string) => void;
	deleteCard: (cardId: string) => void;
}
