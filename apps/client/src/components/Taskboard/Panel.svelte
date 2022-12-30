<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import Card from "./Card/Card.svelte";
	import NewCard from "./Card/NewCard.svelte";

	import type { ClientPanel } from "data-transfer-interfaces/panel/clientPanel";
	import type { ClientCard } from "data-transfer-interfaces/card/clientCard";

	export let panel: ClientPanel;
	export let isFirst: boolean;
	export let isLast: boolean;

	let placeholderCard: ClientCard = {
		id: "placeholder-id",
		title: "Placeholder",
		panel,
		owner: null,
	};

	const dispatch = createEventDispatcher();

	const createCard = () => {
		const title = prompt("Title");
		if (!title) return;
		dispatch("newCard", { title, panelId: panel.id });
	};

	const deletePanel = () => {
		dispatch("delete", panel.id);
	};

	const movePanel = (sortDirection: 1 | -1) => {
		dispatch("move", { id: panel.id, direction: sortDirection });
	};
</script>

<div
	class="bg-neutral-200 panel-height text-black shadow-inner-2xl w-52 lg:w-96 flex-none mx-2"
	id={`panel-${panel.id}`}
>
	<div class="p-1">
		<div class="flex">
			<div class="flex-1">
				<p class="text-lg font-bold">{panel.title}</p>
			</div>
			<div class="grid grid-cols-3 flex-none w-20">
				<div>
					{#if !isFirst}
						<button
							class="hover:bg-neutral-500 hover:no-underline h-full w-full"
							on:click={() => movePanel(-1)}>←</button
						>
					{/if}
				</div>

				<div>
					<button
						class="hover:text-white hover:bg-red-600 h-full w-full"
						on:click={deletePanel}>X</button
					>
				</div>

				<div>
					{#if !isLast}
						<button
							class="hover:bg-neutral-500 hover:no-underline h-full w-full"
							on:click={() => movePanel(1)}>→</button
						>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<div class="grid grid-cols-1 lg:grid-cols-2">
		<NewCard on:createCard={createCard} />
		<Card card={placeholderCard} />
		<Card card={placeholderCard} />
		<Card card={placeholderCard} />
		<Card card={placeholderCard} />
	</div>
</div>
