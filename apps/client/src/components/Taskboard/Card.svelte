<script lang="ts">
	import type { ClientCard } from "data-transfer-interfaces/card/clientCard";

	export let card: ClientCard;
</script>

<div class="bg-neutral-300 h-32 flex m-1">
	<div class="flex-none h-full w-3 bg-yellow-300">
		<button class="h-full w-full grid grid-rows-5">
			<div />
			<div class="relative">
				<div
					class="bg-neutral-600 rounded-full w-2 h-2 absolute-bottom-center"
				/>
			</div>
			<div class="relative">
				<div class="bg-neutral-600 rounded-full w-2 h-2 absolute-center" />
			</div>
			<div class="relative">
				<div class="bg-neutral-600 rounded-full w-2 h-2 absolute-top-center" />
			</div>
			<div />
		</button>
	</div>
	<div class="flex-1 p-1 shadow-inner-xl">
		<p>{card.title}</p>
	</div>
</div>
