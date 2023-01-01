<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import BaseCard from "./BaseCard.svelte";

	import type { ClientCard } from "data-transfer-interfaces/card/clientCard";

	export let card: ClientCard;

	const dispatch = createEventDispatcher();

	const deleteCard = () => {
		dispatch("deleteCard", card.id);
	};

	const moveToRandomPanel = () => {
		dispatch("moveCard", card.id);
	};
</script>

<BaseCard>
	<div
		class="flex-none h-full w-3 bg-yellow-300 hover:bg-yellow-400 active:bg-blue-600 border-t border-b border-l border-neutral-400"
	>
		<button class="h-full w-full" />
	</div>
	<div class="flex-1 shadow-inner-xl">
		<div class="flex">
			<p class="font-bold flex-1 pl-1">{card.title}</p>
			<button
				on:click={deleteCard}
				class="px-1 w-6 h-6 text-neutral-600 hover:font-bold hover:bg-red-700 hover:text-white hover:no-underline active:bg-red-500"
				>X</button
			>
		</div>
		<div class="p-1">
			<button
				on:click={moveToRandomPanel}
				class="font-bold text-xl hover:no-underline hover:text-white active:text-red-600 hover:bg-neutral-700 w-8 h-8 rounded-full pb-px pr-px"
				>↻</button
			>
		</div>
	</div>
</BaseCard>
