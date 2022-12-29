<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { ClientPanel } from "data-transfer-interfaces/panel/clientPanel";

	export let panel: ClientPanel;

	const dispatch = createEventDispatcher();

	const deletePanel = () => {
		dispatch("delete", panel.id);
	};
</script>

<div class="bg-neutral-400 panel-height text-black">
	<div class="p-1">
		<p>{panel.title}</p>
		<button on:click={deletePanel}>DELETE</button>
	</div>
	<hr />
</div>
