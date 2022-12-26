<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import BaseTaskboardButton from "./BaseTaskboardButton.svelte";
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

<BaseTaskboardButton>
	<button
		class="block h-full w-full rounded-sm hover:bg-green-700 active:bg-green-900 hover:no-underline"
		on:click={createNewTaskboard}
	>
		<p class="text-8xl mt-1">+</p>
	</button>
</BaseTaskboardButton>
