<script lang="ts">
	import { onDestroy } from "svelte";
	import type { ClientUser } from "models/user/clientUser";
	import { AuthService } from "./services/authService";
	import Header from "./components/Header.svelte";
	import Content from "./components/Content.svelte";
	let userData: ClientUser | null = null;
	let username: string = "";

	const change = (user: ClientUser) => (userData = user);
	AuthService.listen("App", change);
	onDestroy(() => AuthService.delete("App"));

	console.log("Hello, World!");
</script>

<main class="mx-auto container">
	<Header />
	<Content {userData} />
</main>
