<script lang="ts">
	import { onDestroy } from "svelte";
	import { ClientDataStore } from "./stores/client"; // store

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

	AuthService.onStateChange = async (newClientData: ClientData | null) => {
		ClientDataStore.set(newClientData);
		console.log(AuthState[newClientData?.authState ?? 0]);
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
	{#if $ClientDataStore?.authState === AuthState.LoggedOut}
		<LandingZone />
	{:else if $ClientDataStore?.authState === AuthState.LoggedIn}
		{#if !route}
			<Home />
		{:else}
			<Taskboard taskboardUri={route ? route : null} />
		{/if}
	{:else}
		<Loading />
	{/if}
</main>
