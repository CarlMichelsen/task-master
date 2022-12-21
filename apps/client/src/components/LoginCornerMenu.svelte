<script lang="ts">
	export let visible: boolean = false;
</script>

<div
	class={`absolute ${
		visible ? "top-16" : "bottom-96"
	} right-0 login-corner-menu-width h-min`}
>
	<div
		class={`h-full w-full bg-neutral-300 text-black p-2 rounded-l-md transition-opacity ease-in-out delay-50 motion-reduce:transition-none ${
			visible
				? "opacity-100 pointer-events-auto"
				: "opacity-0 pointer-events-none"
		}`}
	>
		<slot />
	</div>
</div>
