<script lang="ts">
	import { onDestroy } from "svelte";
	import { TaskboardStore } from "../stores/taskboard";
	import { ClientDataStore } from "../stores/client";

	import Header from "../components/Header.svelte";
	import TaskboardHandler from "../components/Taskboard/TaskboardHandler.svelte";
	import Loading from "../components/Loading.svelte";

	import { TaskboardService } from "../services/taskboardService";
	import { RouterService } from "../services/routerService";
	import { WebsocketService } from "../services/websocketService";
	import { mergeLists, sortClientUserList } from "../util/listUtil";

	import type { ClientUser } from "data-transfer-interfaces/user/clientUser";
	import type { ClientPanel } from "data-transfer-interfaces/panel/clientPanel";
	import type { ClientCard } from "data-transfer-interfaces/card/clientCard";

	export let taskboardUri: string | null = null;

	const onForceUpdateConnected = (allConnected: ClientUser[]) => {
		console.log("force", allConnected);
		if (!$TaskboardStore) return;
		const allMembers = mergeLists(
			$TaskboardStore?.members ?? [],
			allConnected
		) as ClientUser[];
		TaskboardStore.set({
			...$TaskboardStore,
			members: allMembers.sort(sortClientUserList($ClientDataStore?.user?.id)),
		});
	};

	const onConnectedJoin = (connected: ClientUser) => {
		if (!$TaskboardStore) return;
		const allMembers = mergeLists($TaskboardStore?.members ?? [], [
			connected,
		]) as ClientUser[];
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

	const onUpdateTaskboardPanel = (panel?: ClientPanel) => {
		if (!$TaskboardStore) return;
		const allPanels = $TaskboardStore.panels;
		TaskboardStore.set({
			...$TaskboardStore,
			panels: (panel
				? (mergeLists(allPanels, [panel]) as ClientPanel[])
				: allPanels
			).sort((p1, p2) => p1.sortOrder - p2.sortOrder),
		});
	};

	const onDeleteTaskboardPanel = (panel: ClientPanel) => {
		if (!$TaskboardStore) return;
		const allPanels = $TaskboardStore.panels;
		TaskboardStore.set({
			...$TaskboardStore,
			panels: allPanels
				.filter((p) => p.id !== panel.id)
				.sort((p1, p2) => p1.sortOrder - p2.sortOrder),
		});
	};

	const onCreateCard = (card: ClientCard) => {
		if (!$TaskboardStore) return;
		const panelIdx = $TaskboardStore.panels.findIndex(
			(p) => p.id === card.panelId
		);
		if (panelIdx === -1) return;

		TaskboardStore.update((taskboard) => {
			taskboard?.panels[panelIdx].cards.push(card);
			return taskboard;
		});
	};

	const onMoveCard = (card: ClientCard, from: string, to: string) => {
		if (!$TaskboardStore) return;
		const fromPanelIdx = $TaskboardStore.panels.findIndex((p) => p.id === from);
		if (fromPanelIdx === -1) return;

		const toPanelIdx = $TaskboardStore.panels.findIndex((p) => p.id === to);
		if (toPanelIdx === -1) return;

		TaskboardStore.update((taskboard) => {
			const idx =
				taskboard?.panels[fromPanelIdx].cards.findIndex(
					(c) => c.id === card.id
				) ?? -1;
			if (idx === -1) return taskboard;
			taskboard?.panels[fromPanelIdx].cards.splice(idx, 1);
			taskboard?.panels[toPanelIdx].cards.push(card);
			return taskboard;
		});
	};

	const onDeleteCard = (card: ClientCard) => {
		if (!$TaskboardStore) return;
		const panelIdx = $TaskboardStore.panels.findIndex(
			(p) => p.id === card.panelId
		);
		if (panelIdx === -1) return;
		TaskboardStore.update((taskboard) => {
			const cardIdx = taskboard?.panels[panelIdx].cards.findIndex(
				(c) => c.id === card.id
			);
			if (cardIdx == null || cardIdx === -1) return taskboard;

			taskboard?.panels[panelIdx].cards.splice(cardIdx, 1);
			return taskboard;
		});
	};

	const connectWebsocket = (jwt: string, uri: string) => {
		WebsocketService.connect(jwt, uri);
		WebsocketService.onUpdateConnected = onForceUpdateConnected;
		WebsocketService.onConnectedJoin = onConnectedJoin;
		WebsocketService.onConnectedLeave = onConnectedLeave;
		WebsocketService.onCreateTaskboardPanel = onUpdateTaskboardPanel;
		WebsocketService.onMoveTaskboardPanel = onUpdateTaskboardPanel;
		WebsocketService.onDeleteTaskboardPanel = onDeleteTaskboardPanel;

		WebsocketService.onCreateCard = onCreateCard;
		WebsocketService.onDeleteCard = onDeleteCard;
		WebsocketService.onMoveCard = onMoveCard;
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
				onUpdateTaskboardPanel();
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
			<TaskboardHandler />
		</div>
	{:else}
		<Loading />
	{/if}
</div>
