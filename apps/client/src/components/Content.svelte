<script lang="ts">
	import type { ClientUser } from "models/user/clientUser";
	import { AuthService } from "../services/authService";
	import CreateUser from "./CreateUser.svelte";
	export let userData: ClientUser | null = null;

	const logout = () => AuthService.logout();
	const forget = () => {
		AuthService.setLocalIdentity(null);
		AuthService.logout();
	};
</script>

<div class="h-12">
	{#if userData !== null}
		<p>Logged in as "{userData?.username ?? null}"</p>
		<button class="bg-black py-2 w-32" on:click={logout}>Logout</button>
		<br />
		<br />
		<button class="bg-black py-2 w-32" on:click={forget}>Forget</button>
	{:else}
		<CreateUser />
	{/if}
</div>
