<div
	class="bg-neutral-200 panel-height text-black shadow-inner-2xl w-64 lg:w-[32rem] flex-none mx-2"
	id={`panel-${panel.id}`}
>
	<div class="p-1">
		<div class="flex">
			<div class="flex-1">
				<p class="text-lg font-bold">{panel.title}</p>
			</div>
			<div class="grid grid-cols-3 flex-none w-20">
				<div>
					{#if !isFirst}
						<button
							class="hover:bg-neutral-500 hover:no-underline h-full w-full"
							on:click={() => movePanel(-1)}>←</button
						>
					{/if}
				</div>

				<div>
					<button
						class="hover:text-white hover:bg-red-600 h-full w-full"
						on:click={deletePanel}>X</button
					>
				</div>

				<div>
					{#if !isLast}
						<button
							class="hover:bg-neutral-500 hover:no-underline h-full w-full"
							on:click={() => movePanel(1)}>→</button
						>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<div class="grid grid-cols-1 lg:grid-cols-2">
		<NewCard on:createCard={createCard} />
		{#each panel.cards as card}
			<Card {card} on:deleteCard={deleteCard} on:moveCard={moveCard} />
		{/each}
	</div>
</div>
