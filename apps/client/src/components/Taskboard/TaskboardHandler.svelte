<script lang="ts">
	import Panel from "./Panel.svelte";

	import { TaskboardStore } from "../../stores/taskboard";
	import { WebsocketService } from "../../services/websocketService";

	const createPanelButton = () => {
		const title = prompt("Panel title");
		if (!title) return;

		WebsocketService.createTaskboardPanel(title, 1);
	};
</script>

<div>
	{#if $TaskboardStore}
		<button on:click={createPanelButton}>CreatePanel</button>
		<div class="grid grid-cols-3 space-x-3">
			{#each $TaskboardStore.panels as panel}
				<Panel {panel} />
			{/each}
		</div>
	{/if}
</div>
