<script lang="ts">
	import Panel from "./Panel.svelte";

	import { TaskboardStore } from "../../stores/taskboard";
	import { WebsocketService } from "../../services/websocketService";

	const createPanelButton = () => {
		const title = prompt("Panel title");
		if (!title) return;
		const panels = $TaskboardStore?.panels ?? [];
		const maxAttempt = Math.max(...panels.map((p) => p.sortOrder));
		const order = isFinite(maxAttempt) ? maxAttempt + 1000 * 1000 : 1000 * 1000;
		console.log(order);
		WebsocketService.createTaskboardPanel(title, order);
	};

	const deletePanelEvent = (event: CustomEvent<string>) => {
		WebsocketService.deleteTaskboardPanel(event.detail as string);
	};

	const movePanelEvent = (
		event: CustomEvent<{ id: string; direction: 1 | -1 }>
	) => {
		const { id, direction } = event.detail;
		const panels = $TaskboardStore?.panels ?? [];
		if (panels.length <= 1) return;
		const panelToMoveId = panels.findIndex((p) => p.id === id);
		if (panelToMoveId === -1) return;

		const nextPanel = panels[panelToMoveId + direction];
		let newOrder = nextPanel.sortOrder + 500 * 1000 * direction;

		const nextPanelAgain = panels[panelToMoveId + direction * 2];
		if (nextPanelAgain) {
			const nextSortOrder = nextPanel.sortOrder;
			const absDiff = Math.abs(nextPanelAgain.sortOrder - nextPanel.sortOrder);
			newOrder = nextSortOrder + (absDiff * direction) / 2; // halfway to next
		}

		WebsocketService.moveTaskboardPanel(id, newOrder);
	};
</script>

<div>
	{#if $TaskboardStore}
		<button on:click={createPanelButton}>CreatePanel</button>
		<div class="grid grid-cols-3 space-x-3">
			{#each $TaskboardStore.panels as panel}
				<Panel {panel} on:delete={deletePanelEvent} on:move={movePanelEvent} />
			{/each}
		</div>
	{/if}
</div>
