<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import BaseCard from "./BaseCard.svelte";

	import { TaskboardService } from "../../services/taskboardService";
	import type { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";

	const dispatch = createEventDispatcher();
	export let taskboard: ClientTaskboard | null;
	let menuToggle: boolean = false;

	const deleteTaskboard = async () => {
		menuToggle = false;
		const conf = confirm(`Are you sure you want to delete ${taskboard.name}?`);
		if (!conf) return;

		const res = await TaskboardService.deleteTaskboard(taskboard.uri);
		if (res.ok) {
			dispatch("deletedTaskboard", res.data);
		} else {
			console.error(res.errors);
		}
	};

	const taskboardClick = () => {
		dispatch("clickedTaskboard", taskboard.uri);
	};
</script>

<BaseCard>
	<div
		class="h-full w-full flex flex-col transition-colors hover:bg-neutral-600"
	>
		<div class="flex-1">
			<button class="block w-full h-28" on:click={taskboardClick}>
				<p>{taskboard.name}</p>
			</button>
		</div>

		<div
			class={`flex-none flex ${
				!menuToggle && "flex-row-reverse pointer-events-none"
			} -mt-8 h-8`}
		>
			<div hidden={!menuToggle} class="flex-1">
				<button
					on:click={deleteTaskboard}
					class="h-full w-full hover:text-red-900 hover:bg-white">delete</button
				>
			</div>

			<div hidden={!menuToggle} class="flex-1" />

			<div hidden={!menuToggle} class="flex-1" />

			<div hidden={!menuToggle} class="flex-1" />

			<div class="flex-none pointer-events-auto">
				<button
					on:click={() => (menuToggle = !menuToggle)}
					class={`block float-right p-1 h-8 w-8 rotate-90 ${
						menuToggle ? "rounded-none" : "rounded-l-full rounded-br-full"
					} hover:bg-neutral-400 active:bg-neutral-500`}
				>
					<img src="/dots.svg" alt="dots" />
				</button>
			</div>
		</div>
	</div>
</BaseCard>
