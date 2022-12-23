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

	export let clientData: ClientData;
	export let taskboardUri: string | null = null;

	let taskboard: ClientTaskboard | null = null;
	let connected: ClientUser[] = [];

	const getTaskboard = async (uri: string | null) => {
		try {
			if (!uri) throw new Error("Invalid taskboard");
			const res = await TaskboardService.getTaskboardByUri(uri);
			if (res.ok) {
				taskboard = res.data ?? null;
				if (!taskboard || !clientData.jwt) throw new Error("Invalid taskboard");

				WebsocketService.connect(clientData.jwt, taskboard.uri);
				WebsocketService.onUpdateConnected = (connectedList) => {
					connected = [...connectedList];
				};
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
		<div class="container mx-auto mt-6 grid grid-cols-2">
			<div>
				<h3 class="text-2xl">Taskboard info</h3>
				<br />
				<p>Taskboard: {taskboard.name}</p>
				<p>Uri: {taskboard.uri}</p>
				<p>Owner: {taskboard.ownerUsername}</p>
			</div>

			<div>
				<h3 class="text-2xl">Connected users</h3>
				<br />
				{#each connected as user}
					<div class="flex w-48 border-b">
						<div class="flex-1">
							<p class="text-lg mt-4">{user.username}</p>
						</div>

						<div class="flex-none">
							<div class="w-16">
								<img
									src="https://avatars.dicebear.com/api/adventurer/{user.imageSeed}.svg"
									alt="profile"
								/>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<Loading />
	{/if}
</div>
