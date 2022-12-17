<script lang="ts">
	import LoginCornerMenu from "./LoginCornerMenu.svelte";
	import LoginForm from "./LoginForm.svelte";

	import { AuthState } from "../models/authState";
	import { AuthService } from "../services/authService";
	export let authState: AuthState = AuthState.LoggedOut;
	export let loginMenu: boolean = false;

	$: (authState) => {
		if (authState === AuthState.LoggedIn) loginMenu = false;
	};

	const logout = () => {
		AuthService.logout();
		loginMenu = false;
	};

	const toggleLoginMenu = () => {
		loginMenu = !loginMenu;
	};
</script>

<div class="h-16 mb-2">
	<div class="h-full grid grid-cols-4">
		<a href="/" class="">
			<h1 class="text-2xl py-1">Task Master</h1>
		</a>

		<div />
		<div />
		<div>
			<button
				disabled={authState === AuthState.Authorizing}
				class={`h-16 bg-slate-600 active:bg-slate-700 hover:bg-green-700 float-right w-36 ${
					authState === AuthState.Authorizing ? "cursor-not-allowed" : ""
				}`}
				on:click={toggleLoginMenu}
				>{authState === AuthState.LoggedIn ? "Profile" : "Login"}</button
			>

			{#if loginMenu}
				<div class="relative">
					<LoginCornerMenu>
						{#if authState === AuthState.LoggedIn}
							<button on:click={logout}>Logout</button>
						{:else if authState === AuthState.Authorizing}
							<p>Authorizing</p>
						{:else}
							<LoginForm />
						{/if}
					</LoginCornerMenu>
				</div>
			{/if}
		</div>
	</div>
</div>
