<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { ClientPanel } from "data-transfer-interfaces/panel/clientPanel";
	import type { ClientCard } from "data-transfer-interfaces/card/clientCard";
	import Card from "./Card.svelte";

	export let panel: ClientPanel;

	let placeholderCard: ClientCard = {
		id: "placeholder-id",
		title: "Placeholder",
		panel,
		owner: null,
	};

	const dispatch = createEventDispatcher();

	const deletePanel = () => {
		dispatch("delete", panel.id);
	};

	const movePanel = (sortDirection: 1 | -1) => {
		dispatch("move", { id: panel.id, direction: sortDirection });
	};
</script>

<div
	class="bg-neutral-200 panel-height text-black shadow-inner-2xl"
	id={`panel-${panel.id}`}
>
	<div class="p-1">
		<div class="flex">
			<div class="flex-1">
				<p class="text-lg font-bold">{panel.title}</p>
			</div>
			<div class="flex flex-none">
				<button
					class="flex-none hover:bg-neutral-500 px-2"
					on:click={() => movePanel(-1)}>←</button
				>
				<button
					class="flex-1 mx-1 px-2 hover:text-white hover:bg-red-600"
					on:click={deletePanel}>X</button
				>
				<button
					class="flex-none hover:bg-neutral-500 px-2"
					on:click={() => movePanel(1)}>→</button
				>
			</div>
		</div>
	</div>
	<div class="grid grid-cols-1 lg:grid-cols-2">
		<Card card={placeholderCard} />
		<Card card={placeholderCard} />
		<Card card={placeholderCard} />
		<Card card={placeholderCard} />
		<Card card={placeholderCard} />
	</div>
</div>
