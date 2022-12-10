<script lang="ts">
	import { AuthService } from "../services/authService";
	let username: string = "";

	const connect = () => {
		if (username.length < 3) return;
		console.log("Attempting to create user", username);
		AuthService.authorize(username);
	};
</script>

<div>
	<h2 class="text-xl">Create User</h2>

	<input
		type="text"
		name="username"
		id="username-input"
		class="py-auto text-lg w-80 h-12 text-center"
		bind:value={username}
		on:submit|preventDefault={connect}
	/>
	<button on:click={connect} class="bg-black h-12 w-28">Create</button>
</div>
