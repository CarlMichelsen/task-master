<script lang="ts">
	import type { ClientPanel } from "data-transfer-interfaces/panel/clientPanel";

	export let panel: ClientPanel;
</script>

<div class="bg-neutral-400 panel-height text-black">
	<div class="p-1">
		<p>{panel.title}</p>
	</div>
	<hr />
</div>
