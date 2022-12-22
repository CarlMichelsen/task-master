<script lang="ts">
	import Header from "../components/Header.svelte";
	import Loading from "../components/Loading.svelte";

	import { TaskboardService } from "../services/taskboardService";

	import type { ClientData } from "../models/clientData";
	import type { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";
	import { RouterService } from "../services/routerService";

	export let clientData: ClientData | null = null;
	export let taskboardUri: string | null = null;

	let taskboard: ClientTaskboard | null = null;

	const getTaskboard = async (uri: string) => {
		try {
			const res = await TaskboardService.getTaskboardByUri(uri);
			if (res.ok) taskboard = res.data;
		} catch (error) {
			RouterService.route = null;
		}
	};

	$: getTaskboard(taskboardUri);
</script>

<div>
	<Header authState={clientData.authState} user={clientData.user} />
	{#if taskboard !== null}
		<div>
			<p>Taskboard: {taskboard.name}</p>
			<p>Uri: {taskboard.uri}</p>
			<p>Owner: {taskboard.ownerUsername}</p>
		</div>
	{:else}
		<Loading />
	{/if}
</div>
