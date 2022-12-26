<script lang="ts">
	import CreateTaskboardButton from "./TaskboardButton/CreateTaskboardButton.svelte";
	import TaskboardButton from "./TaskboardButton/TaskboardButton.svelte";
	import Loading from "./Loading.svelte";

	import type { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";
	import type { ClientData } from "../models/clientData";

	import { TaskboardService } from "../services/taskboardService";
	import { RouterService } from "../services/routerService";

	export let clientData: ClientData;
	let taskboards: ClientTaskboard[] | null = null;

	const getTaskboards = async () => {
		const res = await TaskboardService.getUserTaskboards();
		taskboards = res.ok && res.data ? res.data : [];
	};

	const handleNewTaskboard = (event: CustomEvent<ClientTaskboard>) => {
		if (!taskboards) return;
		const taskboard = event.detail;
		taskboards.push(taskboard);
		taskboards = [...taskboards];
	};

	const handleRemovedTaskboard = (event: CustomEvent<string>) => {
		if (!taskboards) return;
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
				<CreateTaskboardButton on:newTaskboard={handleNewTaskboard} />
				{#each taskboards as board}
					<TaskboardButton
						taskboard={board}
						{clientData}
						on:removedTaskboard={handleRemovedTaskboard}
						on:clickedTaskboard={handleClickTaskboard}
					/>
				{/each}
			</div>
		</div>
	{:else}
		<Loading />
	{/if}
</div>
