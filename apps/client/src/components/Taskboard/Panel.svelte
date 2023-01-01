<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import Card from "./Card/Card.svelte";

	import type { ClientPanel } from "data-transfer-interfaces/panel/clientPanel";

	export let panel: ClientPanel;
	export let isFirst: boolean;
	export let isLast: boolean;
	export let otherPanels: { name: string; id: string }[];

	const dispatch = createEventDispatcher();

	const createCard = () => {
		const title = prompt("Title");
		if (!title) return;
		dispatch("newCard", { panelId: panel.id, title });
	};

	const deleteCard = (event: CustomEvent<string>) => {
		dispatch("deleteCard", event.detail);
	};

	const moveCard = (
		event: CustomEvent<{ cardId: string; toPanel?: string }>
	) => {
		const moveObj = {
			cardId: event.detail.cardId,
			from: panel.id,
			to: event.detail.toPanel,
		};
		dispatch("moveCard", moveObj);
	};

	const deletePanel = () => {
		dispatch("delete", panel.id);
	};

	const movePanel = (sortDirection: 1 | -1) => {
		dispatch("move", { id: panel.id, direction: sortDirection });
	};
</script>

<div
	class="flex-none h-full mx-2 w-64 lg:w-[32rem] rounded-md text-black bg-neutral-300"
>
	<div class="flex mb-2">
		<div class="flex-none pl-1 pt-1">
			<p>{panel.title}</p>
			<p class="text-xs text-neutral-600">{panel.cards.length} cards</p>
		</div>

		<div class="flex-none pl-2">
			<button
				class="hover:no-underline bg-green-600 hover:bg-green-800 hover:text-green-300 rounded-full text-white text-2xl w-8 h-8 mt-2 pr-px pb-px"
				on:click={createCard}>+</button
			>
		</div>

		<div class="flex-1" />

		<div class="flex-none w-20">
			<button
				class="hover:text-white hover:bg-red-600 rounded-tr-md rounded-bl-md h-7 w-7 float-right"
				on:click={deletePanel}>X</button
			>
			<div>
				<button
					class={`hover:bg-neutral-500 hover:no-underline w-5 pb-px float-right ${
						isLast ? "hidden" : ""
					}`}
					on:click={() => movePanel(1)}>→</button
				>
				<button
					class={`hover:bg-neutral-500 hover:no-underline w-5 pb-px float-right ${
						isFirst ? "hidden" : ""
					}`}
					on:click={() => movePanel(-1)}>←</button
				>
			</div>
		</div>
	</div>
	<hr />
	<div class="grid grid-cols-1 lg:grid-cols-2">
		{#each panel.cards as card}
			<Card
				{otherPanels}
				{card}
				on:deleteCard={deleteCard}
				on:moveCard={moveCard}
			/>
		{/each}
	</div>
</div>
