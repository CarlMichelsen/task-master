<script lang="ts">
	import type { ClientUser } from "data-transfer-interfaces/user/clientUser";

	export let user: ClientUser;
	export let isClient: boolean;
</script>

<div
	class={`h-8 ${isClient ? "border-b-2" : "border-b"} ${
		user.online ? "text-white font-bold" : "text-neutral-500"
	}`}
>
	<div class="flex">
		<div class="flex-1">
			<p class="text-lg mt-1 ml-1">{isClient ? "➤ " : ""}{user.username}</p>
		</div>

		<div class="flex-none">
			<img
				class="h-8 w-8"
				src="https://avatars.dicebear.com/api/adventurer/{user.imageSeed}.svg"
				alt="profile"
			/>
		</div>
	</div>
</div>
