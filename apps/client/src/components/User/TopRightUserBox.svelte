<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { ClientDataStore } from "../../stores/client";

	export let toggled: boolean;

	const dispatch = createEventDispatcher();
</script>

<div class="w-full h-full border-b">
	{#if $ClientDataStore && $ClientDataStore.user}
		<div class="flex h-full">
			<div class="flex-1">
				<div class="flex h-full">
					<div class="flex-1">
						<p class="font-bold text-lg">{$ClientDataStore.user.username}</p>
						<p class="font-bold text-xs">
							{$ClientDataStore.user.accountData?.fullName}
						</p>
						<p class="font-bold text-xs">
							{$ClientDataStore.user.accountData?.email}
							{$ClientDataStore.user.accountData?.emailVerified === true
								? "✓"
								: ""}
						</p>
					</div>

					<div class="flex-none">
						<button
							class={`hover:no-underline text-3xl h-full w-9 ${
								toggled
									? "bg-neutral-700 text-black"
									: "active:text-black active:bg-neutral-700 hover:text-neutral-300 hover:bg-neutral-600"
							}`}
							on:click={() => dispatch("click")}>☰</button
						>
					</div>
				</div>
			</div>
			<div class="flex-none relative">
				<p class="text-xs absolute right-0 text-neutral-300">
					{$ClientDataStore.user.upvotes}⇅
				</p>
				<img
					class="h-16 w-16"
					src="https://avatars.dicebear.com/api/adventurer/{$ClientDataStore
						.user.imageSeed}.svg"
					alt="profile"
				/>
			</div>
		</div>
	{/if}
</div>
