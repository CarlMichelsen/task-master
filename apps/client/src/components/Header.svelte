<script lang="ts">
	import LoginCornerMenu from "./LoginCornerMenu.svelte";
	import LoginForm from "./LoginForm.svelte";
	import Profile from "./Profile.svelte";
	import TopRightUserBox from "./User/TopRightUserBox.svelte";

	import { ClientDataStore } from "../stores/client";
	import { TaskboardStore } from "../stores/taskboard";

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

<div class="lg:h-16">
	<div
		class="h-full grid grid-cols-1 grid-rows-3 sm:grid-cols-3 sm:grid-rows-1"
	>
		<div
			class="order-2 sm:order-none col-span-2 row-span-2 relative flex flex-col lg:flex-row"
		>
			<div class="flex-none">
				<h1 class="text-xl text-center sm:text-left sm:ml-12 mr-4 mt-2">
					{headerTitle ? headerTitle : "Task Master"}
				</h1>
			</div>

			{#if headerTitle}
				<button
					class="absolute rotate-180 hover:no-underline top-0 hover:text-black hover:bg-neutral-300 text-3xl w-10 h-10"
					on:click={() => (RouterService.route = null)}>➨</button
				>

				<div class="flex-1">
					<div class="h-16 relative">
						{#each $TaskboardStore?.members ?? [] as member, i}
							<div
								id={`profile-${member.id}`}
								class="absolute"
								style={`margin-left: ${i * 1.5}rem;`}
							>
								<img
									class={`h-16 w-16 ${
										member.online ? "opacity-100" : "opacity-30"
									}`}
									src="https://avatars.dicebear.com/api/adventurer/{member.imageSeed}.svg"
									alt="member-profile"
								/>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<div class="order-1 sm:order-none">
			{#if $ClientDataStore?.authState !== AuthState.LoggedIn}
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
					on:click={toggleLoginMenu}>Login</button
				>
			{:else}
				<div class="float-right w-full h-full h-16 sm:w-96">
					<TopRightUserBox on:click={toggleLoginMenu} toggled={loginMenu} />
				</div>
			{/if}

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
