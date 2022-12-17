<script lang="ts">
	import Header from "./components/Header.svelte";

	import { AuthState } from "./models/authState";
	import type { ClientData } from "./models/clientData";
	import { AuthService } from "./services/authService";

	let clientData: ClientData | null = null;
	AuthService.onStateChange = async (newClientData: ClientData | null) => {
		clientData = { ...newClientData };
		console.log(AuthState[clientData.authState]);
	};
	AuthService.authorize();
</script>

<main class="mx-auto container">
	{#if clientData}
		<Header authState={clientData.authState} />

		{#if clientData.authState === AuthState.LoggedIn}
			<div class="p-2 border border-red-600">
				<p>NODE_ENV: {process.env.NODE_ENV}</p>
				<br />
				<p>Username: "{clientData.user.username}"</p>
				<p class="break-all">JWT: "{clientData.jwt}"</p>
			</div>
		{/if}
	{:else}
		<div>
			<p>Loading...</p>
		</div>
	{/if}
</main>
