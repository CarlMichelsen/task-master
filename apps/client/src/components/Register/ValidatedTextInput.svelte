<script lang="ts">
	import { onMount } from "svelte";
	import type { Validator } from "../../models/validator";
	import { validatorResultObject } from "../../util/validatorResultObject";

	export let id: string;
	export let type: string;
	export let placeholder: string;
	export let value: string = "";

	export let validation: Validator;
	export let validationResult: { [name: string]: boolean } =
		validatorResultObject(validation);
	let ref: HTMLInputElement;

	const change = (text: string) => {
		for (let k in validation) {
			validationResult[k] = validation[k](text);
		}
	};

	$: change(value);

	onMount(() => ref && (ref.type = type));
</script>

<div>
	<label for={id} hidden={true}>{placeholder}</label>
	<input
		{id}
		{placeholder}
		class="form-text-input"
		bind:this={ref}
		bind:value
	/>
	<ul class="mt-1">
		{#each Object.entries(validationResult) as kv}
			<li class={`text-xs ${kv[1] ? "text-green-500" : "text-neutral-500"}`}>
				<div
					class={`grid grid-cols-2 border-b ${
						kv[1] ? "border-green-500" : "border-neutral-500"
					}`}
				>
					<p>{kv[0]}</p>
					<p class="text-right font-bold">{kv[1] ? "✓" : "✕"}</p>
				</div>
			</li>
		{/each}
	</ul>
</div>
