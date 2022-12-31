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

	const createCardEvent = (
		event: CustomEvent<{ panelId: string; title: string }>
	) => {
		const { panelId, title } = event.detail;
		WebsocketService.createCard(panelId, title);
	};

	const moveCardEvent = (
		event: CustomEvent<{ cardId: string; from: string; to: string }>
	) => {
		const { cardId, from, to } = event.detail;
		WebsocketService.moveCard(cardId, from, to);
	};

	const deleteCardEvent = (event: CustomEvent<string>) => {
		const cardId = event.detail;
		WebsocketService.deleteCard(cardId);
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
		if (order) WebsocketService.moveTaskboardPanel(id, order);
	};
</script>

<div>
	{#if $TaskboardStore}
		<button on:click={createPanelButton}>CreatePanel</button>
		<div class="overflow-x-scroll flex flex-nowrap">
			{#each $TaskboardStore.panels as panel, id}
				<Panel
					{panel}
					on:newCard={createCardEvent}
					on:deleteCard={deleteCardEvent}
					on:delete={deletePanelEvent}
					on:move={movePanelEvent}
					isFirst={id === 0}
					isLast={id === $TaskboardStore.panels.length - 1}
				/>
			{/each}
		</div>
	{/if}
</div>
