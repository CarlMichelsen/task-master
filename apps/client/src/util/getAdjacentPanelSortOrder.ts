import type { ClientPanel } from "data-transfer-interfaces/panel/clientPanel";

export const getAdjacentPanelSortOrder = (
	panelId: string,
	direction: 1 | -1,
	panels: ClientPanel[]
): number | null => {
	if (panels.length <= 1) NaN;
	const panelToMoveId = panels.findIndex((p) => p.id === panelId);
	if (panelToMoveId === -1) return null;
	if (panelToMoveId === 0 && direction === -1) return null;
	if (panelToMoveId === panels.length - 1 && direction === 1) return null;

	const nextPanel = panels[panelToMoveId + direction];
	let newOrder = nextPanel.sortOrder + 500 * direction;

	const nextPanelAgain = panels[panelToMoveId + direction * 2];
	if (nextPanelAgain) {
		const nextSortOrder = nextPanel.sortOrder;
		const absDiff = Math.abs(nextPanelAgain.sortOrder - nextPanel.sortOrder);
		newOrder = nextSortOrder + (absDiff * direction) / 2; // halfway to next
	}
	if (isNaN(newOrder) || !isFinite(newOrder)) return null;
	return newOrder;
};
