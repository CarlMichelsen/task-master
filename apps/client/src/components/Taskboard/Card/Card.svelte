<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import BaseCard from "./BaseCard.svelte";

	import type { ClientCard } from "data-transfer-interfaces/card/clientCard";

	export let card: ClientCard;
	export let otherPanels: { name: string; id: string }[];
	let panelSelector: string = card.panelId;

	const dispatch = createEventDispatcher();

	const deleteCard = () => {
		dispatch("deleteCard", card.id);
	};

	const moveToPanel = () => {
		const moveObj: { cardId: string; toPanel?: string } = {
			cardId: card.id,
			toPanel: panelSelector === card.panelId ? undefined : panelSelector,
		};
		dispatch("moveCard", moveObj);
	};
</script>

<BaseCard>
	<div
		class="flex-none h-full w-3 bg-yellow-300 hover:bg-yellow-400 active:bg-blue-600 border-t border-b border-l border-neutral-400"
	>
		<button class="h-full w-full" />
	</div>
	<div class="flex-1 shadow-inner-xl relative">
		<div class="flex">
			<p class="flex-1 pl-1">{card.title}</p>
			<button
				on:click={deleteCard}
				class="px-1 w-6 h-6 text-neutral-600 hover:font-bold hover:bg-red-700 hover:text-white hover:no-underline active:bg-red-500"
				>X</button
			>
		</div>

		<div />

		<div class="p-1 flex absolute w-full bottom-0">
			<select
				name="state"
				class="flex-1 text-white bg-neutral-500 text-ellipsis p-1"
				bind:value={panelSelector}
				on:change={() => moveToPanel()}
			>
				{#each otherPanels as panel}
					<option value={panel.id}>{panel.name}</option>
				{/each}
			</select>
			<button
				on:click={moveToPanel}
				class="flex-none font-bold text-xl hover:no-underline hover:text-white active:text-red-600 hover:bg-neutral-700 w-8 h-8 rounded-full pb-px pr-px ml-1"
				>↻</button
			>
		</div>
	</div>
</BaseCard>
