<script lang="ts">
	import LoginCornerMenu from "./LoginCornerMenu.svelte";
	import LoginForm from "./LoginForm.svelte";
	import Profile from "./Profile.svelte";

	import { ClientDataStore } from "../stores/client";

	import { AuthState } from "../models/authState";
	import { RouterService } from "../services/routerService";

	export let headerTitle: string | null = null;
	let loginMenu: boolean = false;

	$: changed($ClientDataStore?.authState ?? null);

	const changed = (authState: AuthState | null) => {
		if (authState === AuthState.LoggedIn) loginMenu = false;
		if (authState === AuthState.LoggedOut) loginMenu = false;
	};

	const toggleLoginMenu = () => {
		loginMenu = !loginMenu;
	};
</script>

<div class="h-16">
	<div class="h-full grid grid-cols-3">
		<button
			on:click={() => (RouterService.route = null)}
			class="w-36 text-left ml-3"
		>
			<h1 class="text-2xl">{headerTitle ? headerTitle : "Task Master"}</h1>
		</button>

		<div>
			{#if !!$ClientDataStore?.user}
				<div class="mx-auto w-16">
					<img
						src="https://avatars.dicebear.com/api/adventurer/{$ClientDataStore
							.user.imageSeed}.svg"
						alt="profile"
					/>
				</div>
			{/if}
		</div>

		<div>
			<button
				disabled={$ClientDataStore?.authState === AuthState.Authorizing}
				class={`h-16 ${
					loginMenu
						? "bg-green-700 hover:bg-green-800"
						: "bg-slate-600 hover:bg-slate-700"
				}  float-right w-36 ${
					$ClientDataStore?.authState === AuthState.Authorizing
						? "cursor-not-allowed"
						: ""
				}`}
				on:click={toggleLoginMenu}
				>{$ClientDataStore?.authState === AuthState.LoggedIn
					? "Profile"
					: "Login"}</button
			>

			<div class="relative">
				<LoginCornerMenu visible={loginMenu}>
					{#if $ClientDataStore?.authState === AuthState.LoggedIn}
						<Profile />
					{:else if $ClientDataStore?.authState === AuthState.Authorizing}
						<p>Authorizing</p>
					{:else}
						<LoginForm />
					{/if}
				</LoginCornerMenu>
			</div>
		</div>
	</div>
</div>
