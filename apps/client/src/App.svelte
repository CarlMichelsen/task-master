<script lang="ts">
	import Home from "./pages/Home.svelte";
	import Taskboard from "./pages/Taskboard.svelte";
	import LandingZone from "./pages/LandingZone.svelte";

	import Loading from "./components/Loading.svelte";

	import { AuthState } from "./models/authState";
	import { AuthService } from "./services/authService";
	import { RouterService } from "./services/routerService";
	import type { ClientData } from "./models/clientData";

	let clientData: ClientData | null = null;
	AuthService.onStateChange = async (newClientData: ClientData | null) => {
		clientData = { ...newClientData };
		console.log(AuthState[clientData.authState]);
	};

	let route: string | null = null;
	RouterService.onRouteChange = (newRoute: string | null) => {
		route = newRoute;
	};

	RouterService.init();
	AuthService.authorize();
</script>

<main class="h-full w-full">
	{#if clientData?.authState === AuthState.LoggedOut}
		<LandingZone authState={clientData.authState} user={clientData.user} />
	{:else if clientData?.authState === AuthState.LoggedIn}
		{#if !route}
			<Home {clientData} />
		{:else}
			<Taskboard {clientData} taskboard={route ? route : null} />
		{/if}
	{:else}
		<Loading />
	{/if}
</main>
