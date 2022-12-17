<script lang="ts">
	export let visible: boolean = false;
</script>

<div class="absolute top-16 right-0 login-corner-menu-width h-min">
	<div
		class={`h-full w-full bg-gray-400 text-black p-2 rounded-l-md transition-opacity ease-in-out delay-50 motion-reduce:transition-none ${
			visible
				? "opacity-100 pointer-events-auto"
				: "opacity-0 pointer-events-none"
		}`}
	>
		<slot />
	</div>
</div>
