<script lang="ts">
	import LoginCornerMenu from "./LoginCornerMenu.svelte";
	import LoginForm from "./LoginForm.svelte";
	import { AuthState } from "../models/authState";
	import type { ClientUser } from "data-transfer-interfaces/user/clientUser";
	import Profile from "./Profile.svelte";

	export let authState: AuthState = AuthState.LoggedOut;
	export let user: ClientUser | null = null;
	export let loginMenu: boolean = false;

	$: changed(authState);

	const changed = (authState) => {
		if (authState === AuthState.LoggedIn) loginMenu = false;
		if (authState === AuthState.LoggedOut) loginMenu = false;
	};

	const toggleLoginMenu = () => {
		loginMenu = !loginMenu;
	};
</script>

<div class="h-16">
	<div class="h-full grid grid-cols-2">
		<a href="/" class="">
			<h1 class="text-2xl py-1">Task Master</h1>
		</a>

		<div>
			<button
				disabled={authState === AuthState.Authorizing}
				class={`h-16 ${
					loginMenu
						? "bg-green-700 hover:bg-green-800"
						: "bg-slate-600 hover:bg-slate-700"
				}  float-right w-36 ${
					authState === AuthState.Authorizing ? "cursor-not-allowed" : ""
				}`}
				on:click={toggleLoginMenu}
				>{authState === AuthState.LoggedIn ? "Profile" : "Login"}</button
			>

			<div class="relative">
				<LoginCornerMenu visible={loginMenu}>
					{#if authState === AuthState.LoggedIn}
						<Profile {user} />
					{:else if authState === AuthState.Authorizing}
						<p>Authorizing</p>
					{:else}
						<LoginForm />
					{/if}
				</LoginCornerMenu>
			</div>
		</div>
	</div>
</div>
