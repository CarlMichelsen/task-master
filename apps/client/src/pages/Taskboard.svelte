<script lang="ts">
	import { onDestroy } from "svelte";
	import { TaskboardStore } from "../stores/taskboard";
	import { ClientDataStore } from "../stores/client";

	import Header from "../components/Header.svelte";
	import Loading from "../components/Loading.svelte";

	import { TaskboardService } from "../services/taskboardService";
	import { RouterService } from "../services/routerService";
	import { WebsocketService } from "../services/websocketService";
	import {
		mergeClientUserLists,
		sortClientUserList,
	} from "../util/clientUserUtil";

	import type { ClientUser } from "data-transfer-interfaces/user/clientUser";

	export let taskboardUri: string | null = null;

	const onForceUpdateConnected = (allConnected: ClientUser[]) => {
		console.log("force", allConnected);
		if (!$TaskboardStore) return;
		const allMembers = mergeClientUserLists(
			$TaskboardStore?.members ?? [],
			allConnected
		);
		TaskboardStore.set({
			...$TaskboardStore,
			members: allMembers.sort(sortClientUserList($ClientDataStore?.user?.id)),
		});
	};

	const onConnectedJoin = (connected: ClientUser) => {
		if (!$TaskboardStore) return;
		const allMembers = mergeClientUserLists($TaskboardStore?.members ?? [], [
			connected,
		]);
		TaskboardStore.set({
			...$TaskboardStore,
			members: allMembers.sort(sortClientUserList($ClientDataStore?.user?.id)),
		});
	};

	const onConnectedLeave = (disconnected: ClientUser) => {
		if (!$TaskboardStore) return;
		const allMembers = $TaskboardStore?.members ?? [];
		const leaveIdx = allMembers.findIndex((u) => u.id === disconnected.id);
		if (leaveIdx === -1) return;
		allMembers[leaveIdx].online = false;
		TaskboardStore.set({
			...$TaskboardStore,
			members: allMembers.sort(sortClientUserList($ClientDataStore?.user?.id)),
		});
	};

	const connectWebsocket = (jwt: string, uri: string) => {
		WebsocketService.connect(jwt, uri);
		WebsocketService.onUpdateConnected = onForceUpdateConnected;
		WebsocketService.onConnectedJoin = onConnectedJoin;
		WebsocketService.onConnectedLeave = onConnectedLeave;
	};

	const disconnectWebsocket = () => {
		WebsocketService.disconnect();
		RouterService.route = null;
	};

	const getTaskboard = async (uri: string | null) => {
		try {
			if (!uri) throw new Error("Invalid taskboard");
			const res = await TaskboardService.getTaskboardByUri(uri);
			if (res.ok) {
				const nextTaskboard = res.data ?? null;
				if (!nextTaskboard || !$ClientDataStore?.jwt)
					throw new Error("Invalid taskboard");
				TaskboardStore.set(nextTaskboard);
				connectWebsocket($ClientDataStore.jwt, nextTaskboard.uri); // connect
			} else {
				disconnectWebsocket(); // disconnect
			}
		} catch (error) {
			disconnectWebsocket(); // disconnect
		}
	};

	$: getTaskboard(taskboardUri);

	onDestroy(() => {
		TaskboardStore.set(null);
		WebsocketService.disconnect();
	});
</script>

<div>
	<Header headerTitle={$TaskboardStore?.name ?? undefined} />
	{#if $TaskboardStore !== null && $ClientDataStore?.user}
		<div>
			<p>Current taskboard name: "{$TaskboardStore.name}"</p>
			{#each $TaskboardStore.members as member}
				<p>{member.username} - {member.online}</p>
			{/each}
		</div>
	{:else}
		<Loading />
	{/if}
</div>
