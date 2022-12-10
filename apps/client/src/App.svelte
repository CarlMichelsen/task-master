<script lang="ts">
	import { onDestroy } from "svelte";
	import type { ClientUser } from "models/user/clientUser";
	import { AuthService } from "./services/authService";
	let userData: ClientUser | null = null;
	let username: string = "";

	const change = (user: ClientUser) => (userData = user);
	AuthService.listen("App", change);
	onDestroy(() => AuthService.delete("App"));

	const connect = () => {
		if (username.length < 3) return;
		console.log("Attempting to create user", username);
		AuthService.authorize(username);
	};

	console.log("Hello, World!");
</script>

<main>
	<h1>Hello, World!</h1>
	<p>{userData?.username}</p>
	<input type="text" name="username" id="username" bind:value={username} />
	<button on:click={connect}>Connect</button>
</main>
