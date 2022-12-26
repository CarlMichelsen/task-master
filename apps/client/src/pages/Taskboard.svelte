<script lang="ts">
	import { onDestroy } from "svelte";
	import Header from "../components/Header.svelte";
	import Loading from "../components/Loading.svelte";

	import { TaskboardService } from "../services/taskboardService";
	import { RouterService } from "../services/routerService";
	import { WebsocketService } from "../services/websocketService";

	import type { ClientData } from "../models/clientData";
	import type { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";
	import type { ClientUser } from "data-transfer-interfaces/user/clientUser";
	import CornerMembers from "../components/Connected/CornerMembers.svelte";

	export let clientData: ClientData;
	export let taskboardUri: string | null = null;

	let taskboard: ClientTaskboard | null = null;

	const onUpdateConnected = (connectedList: ClientUser[]) => {
		if (!taskboard) return;
		const newUsers = taskboard.members.filter((m) =>
			connectedList.find((c) => c.id === m.id)
		);

		for (let usr of newUsers) {
			const exsistingIdx =
				taskboard.members.findIndex((u) => u.id === usr.id) ?? null;
			if (exsistingIdx === -1) {
				taskboard.members.push({ ...usr, online: true });
			}
		}

		for (let usr of taskboard.members) {
			const exsisting = !!connectedList.find((u) => u.id === usr.id) ?? null;
			usr.online = exsisting;
		}

		taskboard = { ...taskboard };
	};

	const getTaskboard = async (uri: string | null) => {
		try {
			if (!uri) throw new Error("Invalid taskboard");
			const res = await TaskboardService.getTaskboardByUri(uri);
			if (res.ok) {
				taskboard = res.data ?? null;
				if (!taskboard || !clientData.jwt) throw new Error("Invalid taskboard");
				WebsocketService.connect(clientData.jwt, taskboard.uri);
				WebsocketService.onUpdateConnected = onUpdateConnected;
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
	<Header
		authState={clientData.authState}
		user={clientData.user}
		headerTitle={taskboard?.name ?? undefined}
	/>
	{#if taskboard !== null && clientData.user}
		<div class="relative">
			<div class="absolute left-0 top-0">
				<CornerMembers users={taskboard.members} client={clientData.user} />
			</div>
		</div>
	{:else}
		<Loading />
	{/if}
</div>
