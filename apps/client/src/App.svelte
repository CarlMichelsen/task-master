<script lang="ts">
	import { onDestroy } from "svelte";

	import Home from "./pages/Home.svelte";
	import Taskboard from "./pages/Taskboard.svelte";
	import LandingZone from "./pages/LandingZone.svelte";

	import Loading from "./components/Loading.svelte";

	import { AuthState } from "./models/authState";
	import { AuthService } from "./services/authService";
	import { RouterService } from "./services/routerService";
	import type { ClientData } from "./models/clientData";

	let route: string | null = null;

	const hashchange = () => RouterService.init();
	const routeChange = (newRoute: string | null) => (route = newRoute);

	let clientData: ClientData | null = null;
	AuthService.onStateChange = async (newClientData: ClientData | null) => {
		clientData = { ...newClientData };
		console.log(AuthState[clientData.authState]);
	};

	RouterService.onRouteChange = routeChange;

	RouterService.init();
	AuthService.authorize();

	addEventListener("hashchange", hashchange);
	onDestroy(() => {
		removeEventListener("hashchange", hashchange);
	});
</script>

<main class="h-full w-full">
	{#if clientData?.authState === AuthState.LoggedOut}
		<LandingZone authState={clientData.authState} user={clientData.user} />
	{:else if clientData?.authState === AuthState.LoggedIn}
		{#if !route}
			<Home {clientData} />
		{:else}
			<Taskboard {clientData} taskboardUri={route ? route : null} />
		{/if}
	{:else}
		<Loading />
	{/if}
</main>
