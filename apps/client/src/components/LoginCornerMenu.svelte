<script lang="ts">
	export let visible: boolean = false;
</script>

<div
	class={`absolute z-30 ${
		visible ? "top-32 sm:top-20" : "bottom-96"
	} right-4 sm:right-8 w-80 shadow-xl`}
>
	<div
		class={`h-full w-full bg-neutral-700 p-1 transition-opacity ease-in-out delay-50 motion-reduce:transition-none ${
			visible
				? "opacity-100 pointer-events-auto"
				: "opacity-0 pointer-events-none"
		}`}
	>
		<slot />
	</div>
</div>
