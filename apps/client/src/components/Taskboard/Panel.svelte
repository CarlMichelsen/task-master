<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { ClientPanel } from "data-transfer-interfaces/panel/clientPanel";

	export let panel: ClientPanel;

	const dispatch = createEventDispatcher();

	const deletePanel = () => {
		dispatch("delete", panel.id);
	};

	const movePanel = (sortDirection: 1 | -1) => {
		dispatch("move", { id: panel.id, direction: sortDirection });
	};
</script>

<div class="bg-neutral-400 panel-height text-black">
	<div class="p-1">
		<p class="text-lg font-bold">{panel.title}</p>
		<div class="flex">
			<button class="flex-none" on:click={() => movePanel(-1)}>←</button>
			<button class="flex-1" on:click={deletePanel}>DELETE THIS PANEL</button>
			<button class="flex-none" on:click={() => movePanel(1)}>→</button>
		</div>
	</div>
	<hr />
</div>
