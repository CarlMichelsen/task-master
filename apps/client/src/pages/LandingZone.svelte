<script lang="ts">
	import Register from "../components/Register.svelte";
	import Header from "../components/Header.svelte";

	import type { ClientUser } from "data-transfer-interfaces/user/clientUser";
	import type { AuthState } from "../models/authState";

	export let authState: AuthState;
	export let user: ClientUser;
</script>

<div>
	<Header {authState} {user} />
	<div class="mx-auto container">
		<Register />
	</div>
</div>
