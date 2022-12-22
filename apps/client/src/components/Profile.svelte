<script lang="ts">
	import type { ClientUser } from "data-transfer-interfaces/user/clientUser";
	import { AuthService } from "../services/authService";

	export let user: ClientUser;

	const logout = () => {
		AuthService.logout();
	};

	const deleteAccountButton = () => {
		const usernameTypedIn = prompt(
			"Provide your username to confirm deletion."
		);
		if (usernameTypedIn === user.username) AuthService.deleteAccount();
	};
</script>

<div>
	<p class="text-lg">Username: {user.username}</p>
	<br />
	<button
		class="text-xl bg-neutral-500 hover:bg-neutral-600 h-12 w-full mb-1"
		on:click={logout}>Logout</button
	>
	<div>
		<button
			class="block text-red-500 hover:text-red-900 hover:underline ml-auto"
			on:click={deleteAccountButton}>Delete account</button
		>
	</div>
</div>
