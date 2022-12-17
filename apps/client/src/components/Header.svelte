<script lang="ts">
	import { AuthService } from "../services/authService";
	export let loggedIn: boolean;

	const login = () => {
		AuthService.login("test@mail.com", "12345678");
	};
	const logout = () => {
		AuthService.logout();
	};
</script>

<div class="h-12">
	<div class="h-full grid grid-cols-4">
		<a href="/" class="">
			<h1 class="text-2xl py-1">Task Master</h1>
		</a>

		<div />
		<div />
		<div>
			{#if loggedIn}
				<button
					class="py-4 px-2 bg-slate-600 active:bg-slate-700 hover:bg-red-700 float-right w-36"
					on:click={logout}>logout</button
				>
			{:else}
				<button
					class="py-4 px-2 bg-slate-600 active:bg-slate-700 hover:bg-green-700 float-right w-36"
					on:click={login}>login</button
				>
			{/if}
		</div>
	</div>
</div>
