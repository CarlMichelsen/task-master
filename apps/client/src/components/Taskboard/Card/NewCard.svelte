<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import BaseCard from "./BaseCard.svelte";

	const dispatch = createEventDispatcher();
</script>

<BaseCard>
	<button
		on:click={() => dispatch("createCard")}
		class="h-full w-full font-bold text-9xl text-green-800 hover:no-underline hover:text-green-400 hover:bg-white"
		>+</button
	>
</BaseCard>
