<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import Panel from "./Panel.svelte";

	import { TaskboardStore } from "../../stores/taskboard";
	import { WebsocketService } from "../../services/websocketService";

	import { getAdjacentPanelSortOrder } from "../../util/getAdjacentPanelSortOrder";
	import type { ClientPanel } from "data-transfer-interfaces/panel/clientPanel";

	let panelHolderRef: HTMLDivElement;

	const setToRemainingScreenHeight = (div: HTMLDivElement) => {
		const rect = div.getBoundingClientRect();
		const screenHeight = window.innerHeight;
		const remainingHeight = screenHeight - rect.top;
		div.style.height = `${remainingHeight}px`;
	};

	const eventSetToRemainingScreenHeight = () =>
		setToRemainingScreenHeight(panelHolderRef);

	onMount(() => {
		setToRemainingScreenHeight(panelHolderRef);
		addEventListener("resize", eventSetToRemainingScreenHeight);
	});

	onDestroy(() => {
		removeEventListener("resize", eventSetToRemainingScreenHeight);
	});

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
		const { cardId, from } = event.detail;
		const validPanels =
			$TaskboardStore?.panels.filter((p) => p.id !== from) ?? [];
		if (validPanels.length === 0) return;

		const to =
			event.detail.to ??
			validPanels[Math.floor(Math.random() * validPanels.length)].id;

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

	const otherPanelsFormat = (
		panel: ClientPanel
	): { name: string; id: string } => {
		return {
			name: panel.title,
			id: panel.id,
		};
	};
</script>

<div>
	{#if $TaskboardStore}
		<button
			on:click={createPanelButton}
			class="ml-2 bg-green-600 hover:bg-green-800 hover:text-bg-green-900 active:text-black text-white py-1 px-4 rounded-md mb-2"
			>New Panel</button
		>
		<div class="overflow-x-scroll flex flex-nowrap" bind:this={panelHolderRef}>
			{#each $TaskboardStore.panels as panel, id}
				<Panel
					{panel}
					on:newCard={createCardEvent}
					on:moveCard={moveCardEvent}
					on:deleteCard={deleteCardEvent}
					on:delete={deletePanelEvent}
					on:move={movePanelEvent}
					otherPanels={$TaskboardStore.panels.map(otherPanelsFormat)}
					isFirst={id === 0}
					isLast={id === $TaskboardStore.panels.length - 1}
				/>
			{/each}
		</div>
	{/if}
</div>
