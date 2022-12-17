<script lang="ts">
	import { AuthService } from "../services/authService";
	let email: string = "";
	let password: string = "";

	const login = () => {
		if (email == null) return;
		if (password == null) return;

		AuthService.login(email, password);
	};
</script>

<div>
	<label class="text-xl" for="username-input">Login</label>
	<br />
	<br />
	<form class="text-white">
		<input
			type="email"
			name="email"
			id="email-input"
			class="text-xl w-full h-12 text-center bg-gray-600"
			placeholder="email"
			bind:value={email}
			on:submit|preventDefault={login}
		/>

		<br />
		<br />

		<input
			type="password"
			name="password"
			id="password-input"
			class="text-xl w-full h-12 text-center bg-gray-600"
			placeholder="password"
			bind:value={password}
			on:submit|preventDefault={login}
		/>

		<br />
		<br />

		<input
			type="submit"
			value="Login"
			on:click|preventDefault={login}
			class="text-xl bg-gray-600 h-12 w-full"
		/>
	</form>
</div>
