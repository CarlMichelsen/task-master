<script lang="ts">
	import TaskboardCard from "./Card/TaskboardCard.svelte";
	import NewTaskboardCard from "./Card/NewTaskboardCard.svelte";

	import type { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";
	import type { ClientData } from "../models/clientData";
	import { TaskboardService } from "../services/taskboardService";
	import Loading from "./Loading.svelte";

	export let clientData: ClientData;

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

	getTaskboards();
</script>

<div>
	{#if taskboards !== null}
		<div class="mx-auto container">
			<div
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
			>
				{#each taskboards as board}
					<TaskboardCard
						taskboard={board}
						on:deletedTaskboard={handleDeletedTaskboard}
					/>
				{/each}
				<NewTaskboardCard on:newTaskboard={handleNewTaskboard} />
			</div>
		</div>
	{:else}
		<Loading />
	{/if}
</div>
