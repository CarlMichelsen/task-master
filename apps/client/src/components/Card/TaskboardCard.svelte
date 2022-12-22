<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import BaseCard from "./BaseCard.svelte";
	import type { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";
	import { TaskboardService } from "../../services/taskboardService";

	const dispatch = createEventDispatcher();
	export let taskboard: ClientTaskboard | null;

	const deleteTaskboard = async () => {
		const res = await TaskboardService.deleteTaskboard(taskboard.uri);
		if (res.ok) {
			dispatch("deletedTaskboard", res.data);
		} else {
			console.error(res.errors);
		}
	};
</script>

<BaseCard>
	<div class="grid grid-rows-3 h-full w-full">
		<div>
			<p class="">{taskboard.name}</p>
		</div>

		<div />

		<div>
			<button
				class="mt-1 mr-0.5 float-right text-red-500 hover:text-red-700 active:text-black h-6 w-6"
				on:click={deleteTaskboard}>X</button
			>
		</div>
	</div>
</BaseCard>
