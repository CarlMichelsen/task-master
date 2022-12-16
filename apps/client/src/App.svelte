<script lang="ts">
	import Header from "./components/Header.svelte";
	import { AuthService } from "./services/authService";
	let jwt = AuthService.jwt;
	AuthService.onStateChange = async (newJwt: string, fresh: boolean) => {
		if (fresh) {
			jwt = newJwt;
			return;
		}

		if (!newJwt) {
			jwt = null;
			return;
		}

		try {
			const authorized = await AuthService.isAuthorized();
			if (authorized) {
				jwt = newJwt;
			} else {
				jwt = null;
			}
		} catch (error) {
			jwt = null;
		}
	};

	AuthService.forceRunStateChangeAction();

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

	<p class="break-all">JWT: "{jwt}"</p>
	<br />
	<button class="py-4 px-2 bg-slate-600" on:click={login}>login</button>
	<button class="py-4 px-2 bg-slate-600" on:click={logout}>logout</button>
</main>
