<script lang="ts">
	import Header from "../components/Header.svelte";
	import ProfileHome from "../components/ProfileHome.svelte";
	import type { ClientData } from "../models/clientData";

	export let clientData: ClientData;
</script>

<div>
	<Header authState={clientData.authState} user={clientData.user} />
	<ProfileHome {clientData} />
</div>
