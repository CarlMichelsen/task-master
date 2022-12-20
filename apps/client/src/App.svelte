<script lang="ts">
	import Home from "./pages/Home.svelte";
	import Taskboard from "./pages/Taskboard.svelte";

	import { AuthState } from "./models/authState";
	import { AuthService } from "./services/authService";
	import type { ClientData } from "./models/clientData";

	import { Page, router } from "./router";

	let clientData: ClientData | null = null;
	AuthService.onStateChange = async (newClientData: ClientData | null) => {
		clientData = { ...newClientData };
		console.log(AuthState[clientData.authState]);
	};
	AuthService.authorize();

	const route = router();
</script>

<main class="h-full w-full">
	{#if route.currentPage === Page.Home}
		<Home {clientData} />
	{/if}

	{#if route.currentPage === Page.Taskboard}
		<Taskboard
			{clientData}
			taskboard={route.taskboard ? route.taskboard : null}
		/>
	{/if}
</main>
