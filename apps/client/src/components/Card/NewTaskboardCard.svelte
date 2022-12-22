<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import BaseCard from "./BaseCard.svelte";
	import { TaskboardService } from "../../services/taskboardService";

	const dispatch = createEventDispatcher();
	const createNewTaskboard = async () => {
		const name = prompt("Taskboard name");
		if (!name) return;

		const res = await TaskboardService.createTaskboard({
			taskboardName: name,
		});
		if (res.ok) {
			dispatch("newTaskboard", res.data);
		} else {
			alert(res.errors.join("\n"));
		}
	};
</script>

<BaseCard>
	<button
		class="block h-full w-full rounded-sm hover:bg-green-700 active:bg-green-900"
		on:click={createNewTaskboard}
	>
		Create
	</button>
</BaseCard>
