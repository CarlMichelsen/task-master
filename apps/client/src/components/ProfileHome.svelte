<script lang="ts">
	import type { ClientData } from "../models/clientData";

	export let clientData: ClientData;
</script>

<div class="p-2 border border-red-600">
	<p>NODE_ENV: {process.env.NODE_ENV}</p>
	<br />
	<p>Username: "{clientData.user.username}"</p>
	<p class="break-all">JWT: "{clientData.jwt}"</p>
</div>
