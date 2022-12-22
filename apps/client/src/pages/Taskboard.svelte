<script lang="ts">
	import { onDestroy } from "svelte";
	import Header from "../components/Header.svelte";
	import Loading from "../components/Loading.svelte";

	import { TaskboardService } from "../services/taskboardService";
	import { RouterService } from "../services/routerService";
	import { WebsocketService } from "../services/websocketService";

	import type { ClientData } from "../models/clientData";
	import type { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";

	export let clientData: ClientData;
	export let taskboardUri: string | null = null;

	let taskboard: ClientTaskboard | null = null;

	const getTaskboard = async (uri: string) => {
		try {
			const res = await TaskboardService.getTaskboardByUri(uri);
			if (res.ok) {
				taskboard = res.data;
				WebsocketService.connect(clientData.jwt, taskboard.uri);
			} else {
				WebsocketService.disconnect();
			}
		} catch (error) {
			WebsocketService.disconnect();
			RouterService.route = null;
		}
	};

	$: getTaskboard(taskboardUri);

	onDestroy(() => {
		WebsocketService.disconnect();
	});
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
