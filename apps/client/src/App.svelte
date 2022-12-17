<script lang="ts">
	import type { ClientUser } from "models/user/clientUser";
	import Header from "./components/Header.svelte";
	import { AuthState } from "./models/authState";
	import { AuthService } from "./services/authService";
	let jwt = AuthService.jwt;
	let clientData: ClientUser | null;
	AuthService.onStateChange = async (newJwt: string) => {
		if (newJwt == null) {
			jwt = null;
			return;
		}

		const authResponse = await AuthService.authorize();

		jwt = newJwt;
		clientData = authResponse.user;
	};
</script>

<main class="mx-auto container">
	<Header loggedIn={!!jwt} />

	<p>NODE_ENV: {process.env.NODE_ENV}</p>

	<p class="break-all">JWT: "{jwt}"</p>
</main>
