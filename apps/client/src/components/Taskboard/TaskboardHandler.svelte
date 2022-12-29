<script lang="ts">
	import Panel from "./Panel.svelte";

	import { TaskboardStore } from "../../stores/taskboard";
	import { WebsocketService } from "../../services/websocketService";

	const createPanelButton = () => {
		const title = prompt("Panel title");
		if (!title) return;

		WebsocketService.createTaskboardPanel(
			title,
			($TaskboardStore?.panels.length ?? 1) * 1000 * 1000
		);
	};

	const deleteEvent = (event: CustomEvent<string>) => {
		WebsocketService.deleteTaskboardPanel(event.detail as string);
	};
</script>

<div>
	{#if $TaskboardStore}
		<button on:click={createPanelButton}>CreatePanel</button>
		<div class="grid grid-cols-3 space-x-3">
			{#each $TaskboardStore.panels as panel}
				<Panel {panel} on:delete={deleteEvent} />
			{/each}
		</div>
	{/if}
</div>
