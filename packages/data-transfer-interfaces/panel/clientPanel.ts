import { ClientCard } from "../card/clientCard";

export interface ClientPanel {
	id: string;
	taskboardId: string;
	title: string;
	sortOrder: number;
	cards: ClientCard[];
}
