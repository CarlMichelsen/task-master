<script lang="ts">
	import type { ClientUser } from "data-transfer-interfaces/user/clientUser";
	import DisplayUser from "./DisplayUser.svelte";
	export let client: ClientUser;
	export let users: ClientUser[];
	let sortedUsers: ClientUser[] = [];
	let open: boolean = true;

	const sortFunction = (usr: ClientUser) => {
		let sortNum = usr.username.localeCompare(usr.username);
		sortNum += usr.online ? -100000000 : 1;
		sortNum += client.id === usr.id ? -200000000 : -1;
		return sortNum;
	};

	const handleUsers = (list: ClientUser[]) => {
		sortedUsers = list.sort((u1, u2) => sortFunction(u1) - sortFunction(u2));
	};

	$: handleUsers(users);
</script>

<div class="w-64">
	<div class="flex">
		<div class="flex-1">
			<button
				class={`hover:no-underline w-full bg-neutral-600 hover:bg-neutral-400 active:bg-neutral-600 ${
					open ? "pb-1" : "pt-1"
				}`}
				on:click={() => (open = !open)}>{open ? "🢁" : "🢃"}</button
			>
		</div>
		<div
			class="flex-none w-36 pl-1 pt-0.5 border-neutral-600 border-r border-t border-b"
		>
			<p>{client.username}</p>
		</div>
	</div>
	<div class={`overflow-x-hidden ${open ? "" : "h-0"}`}>
		{#each sortedUsers as user}
			<DisplayUser {user} isClient={client.id === user.id} />
		{/each}
	</div>
</div>
