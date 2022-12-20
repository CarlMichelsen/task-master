<script lang="ts">
	import type { ClientData } from "../models/clientData";

	export let clientData: ClientData | null;
	export let taskboard: string | null;
</script>

<div>
	<p>Taskboard: {taskboard}</p>
</div>
