<script lang="ts">
	import TaskboardCard from "./Card/TaskboardCard.svelte";
	import NewTaskboardCard from "./Card/NewTaskboardCard.svelte";
	import Loading from "./Loading.svelte";

	import type { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";

	import { TaskboardService } from "../services/taskboardService";
	import { RouterService } from "../services/routerService";

	let taskboards: ClientTaskboard[] | null = null;

	const getTaskboards = async () => {
		const res = await TaskboardService.getUserTaskboards();
		taskboards = res.ok ? res.data : [];
	};

	const handleNewTaskboard = (event: CustomEvent<ClientTaskboard>) => {
		const taskboard = event.detail;
		taskboards.push(taskboard);
		taskboards = [...taskboards];
	};

	const handleDeletedTaskboard = (event: CustomEvent<string>) => {
		const uri = event.detail;
		const idx = taskboards.findIndex((t) => t.uri === uri);
		if (idx !== -1) {
			taskboards.splice(idx, 1);
			taskboards = [...taskboards];
		}
	};

	const handleClickTaskboard = (event: CustomEvent<string>) => {
		if (!event.detail) return;
		RouterService.route = event.detail;
	};

	getTaskboards();
</script>

<div>
	{#if taskboards !== null}
		<div class="mx-auto container">
			<br />
			<div
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
			>
				<NewTaskboardCard on:newTaskboard={handleNewTaskboard} />
				{#each taskboards as board}
					<TaskboardCard
						taskboard={board}
						on:deletedTaskboard={handleDeletedTaskboard}
						on:clickedTaskboard={handleClickTaskboard}
					/>
				{/each}
			</div>
		</div>
	{:else}
		<Loading />
	{/if}
</div>
