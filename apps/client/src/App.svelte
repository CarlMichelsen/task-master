<script lang="ts">
	import Header from "./components/Header.svelte";
	import { AuthService } from "./services/authService";
	let jwt = AuthService.jwt;
	AuthService.onStateChange = (newJwt: string) => (jwt = newJwt);

	console.log("Hello, World!");
	const login = () => {
		AuthService.login("test@mail.com", "12345678");
	};
	const logout = () => {
		AuthService.logout();
	};
</script>

<main class="mx-auto container">
	<Header />

	<p>NODE_ENV: {process.env.NODE_ENV}</p>

	<p>{jwt}</p>
	<br />
	<button class="py-4 px-2 bg-slate-400" on:click={login}>login</button>
	<button class="py-4 px-2 bg-slate-400" on:click={logout}>logout</button>
</main>
