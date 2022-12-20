<script lang="ts">
	import Header from "../components/Header.svelte";
	import ProfileHome from "../components/ProfileHome.svelte";
	import LandingZone from "../components/LandingZone.svelte";
	import Loading from "../components/Loading.svelte";

	import { AuthState } from "../models/authState";
	import type { ClientData } from "../models/clientData";

	export let clientData: ClientData | null;
</script>

<div>
	{#if clientData}
		<Header authState={clientData.authState} user={clientData.user} />
		{#if clientData.authState === AuthState.LoggedIn}
			<ProfileHome {clientData} />
		{:else if clientData.authState === AuthState.LoggedOut}
			<LandingZone />
		{/if}
	{:else}
		<Loading />
	{/if}
</div>
