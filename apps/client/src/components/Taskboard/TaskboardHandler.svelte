<script lang="ts">
	import Panel from "./Panel.svelte";

	import { TaskboardStore } from "../../stores/taskboard";
	import { WebsocketService } from "../../services/websocketService";

	import { getAdjacentPanelSortOrder } from "../../util/getAdjacentPanelSortOrder";

	const createPanelButton = () => {
		const title = prompt("Panel title");
		if (!title) return;
		const panels = $TaskboardStore?.panels ?? [];
		const maxAttempt = Math.max(...panels.map((p) => p.sortOrder));
		const order = isFinite(maxAttempt) ? maxAttempt + 1000 : 1000;
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
		const order = getAdjacentPanelSortOrder(id, direction, panels);
		if (!isNaN(order)) WebsocketService.moveTaskboardPanel(id, order);
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
