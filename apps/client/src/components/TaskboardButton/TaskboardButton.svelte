<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import BaseTaskboardButton from "./BaseTaskboardButton.svelte";

	import { TaskboardService } from "../../services/taskboardService";
	import type { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";
	import type { ClientData } from "../../models/clientData";

	const dispatch = createEventDispatcher();
	export let taskboard: ClientTaskboard | null;
	export let clientData: ClientData;

	let menuToggle: boolean = false;

	const deleteTaskboard = async () => {
		menuToggle = false;
		if (!taskboard) return;
		const conf = confirm(`Are you sure you want to delete ${taskboard.name}?`);
		if (!conf) return;

		const res = await TaskboardService.deleteTaskboard(taskboard.uri);
		if (res.ok) {
			dispatch("removedTaskboard", res.data);
		} else {
			console.error(res.errors);
		}
	};

	const leaveTaskboard = async () => {
		menuToggle = false;
		if (!taskboard) return;
		const res = await TaskboardService.leaveTaskboard(taskboard.uri);
		if (res.ok) {
			dispatch("removedTaskboard", res.data);
		} else {
			console.error(res.errors);
		}
	};

	const taskboardClick = () => {
		if (!taskboard) return;
		dispatch("clickedTaskboard", taskboard.uri);
	};
</script>

<BaseTaskboardButton>
	{#if taskboard}
		<div
			class="h-full w-full flex flex-col transition-colors hover:bg-neutral-600"
		>
			<div class="flex-1 relative">
				<button class="block w-full h-28" on:click={taskboardClick}>
					<p>{taskboard.name}</p>
				</button>

				<div class="absolute top-2 left-2 z-20 pointer-events-none">
					<p class="text-xs text-neutral-400">
						{clientData.user?.username === taskboard.owner.username
							? "You own this taskboard"
							: ""}
					</p>
				</div>

				<div class="absolute top-2 right-2 z-20 pointer-events-none">
					<p class="text-xs text-neutral-400">
						{taskboard.members.length}
						member{taskboard.members.length > 1 ? "s" : ""}
					</p>
				</div>
			</div>

			<div
				class={`flex-none flex ${
					!menuToggle && "flex-row-reverse pointer-events-none"
				} -mt-8 h-8 z-20`}
			>
				<div hidden={!menuToggle} class="flex-1">
					{#if clientData.user?.username === taskboard.owner.username}
						<button
							on:click={deleteTaskboard}
							class="h-full w-full hover:text-red-900 hover:bg-white"
							>delete</button
						>
					{:else}
						<button
							on:click={leaveTaskboard}
							class="h-full w-full hover:text-red-900 hover:bg-white"
							>leave</button
						>
					{/if}
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
	{/if}
</BaseTaskboardButton>
