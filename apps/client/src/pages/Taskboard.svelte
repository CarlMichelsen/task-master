<script lang="ts">
	import Header from "../components/Header.svelte";
	import Loading from "../components/Loading.svelte";

	import type { ClientData } from "../models/clientData";

	export let clientData: ClientData | null;
	export let taskboard: string | null;
</script>

<div>
	{#if clientData}
		<Header authState={clientData.authState} user={clientData.user} />
		<p>Taskboard: {taskboard}</p>
	{:else}
		<Loading />
	{/if}
</div>
