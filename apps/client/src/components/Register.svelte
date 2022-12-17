<script lang="ts">
	import { AuthService } from "../services/authService";

	let username: string = "";
	let email: string = "";
	let fullname: string = "";
	let password1: string = "";
	let password2: string = "";

	const submit = async () => {
		if (password1 !== password2) {
			alert("Passwords don't match!");
			return;
		}

		const res = await AuthService.register(
			username,
			fullname,
			email,
			password1
		);

		if (!res.complete) alert(res.errors.join("\n"));
	};
</script>

<div>
	<h2 class="text-xl">Register an account</h2>

	<form type="post">
		<label for="username-id" hidden={true}>Username</label>
		<br />
		<input
			bind:value={username}
			type="text"
			name="username"
			id="username-id"
			placeholder="Display name"
			class="form-text-input"
			on:click|preventDefault={submit}
		/>

		<br />

		<label for="email-id" hidden={true}>Email</label>
		<br />
		<input
			bind:value={email}
			type="email"
			name="email"
			id="email-id"
			placeholder="Email"
			pattern={`/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/`}
			class="form-text-input"
			on:click|preventDefault={submit}
		/>

		<br />

		<label for="fullname-id" hidden={true}>Full name</label>
		<br />
		<input
			bind:value={fullname}
			type="text"
			name="fullname"
			id="fullname-id"
			placeholder="Full name"
			class="form-text-input"
			on:click|preventDefault={submit}
		/>

		<br />

		<label for="password1-id" hidden={true}>Password</label>
		<br />
		<input
			bind:value={password1}
			type="password"
			name="password1"
			id="password1-id"
			placeholder="Password"
			class="form-text-input"
			on:click|preventDefault={submit}
		/>

		<br />

		<label for="password2-id" hidden={true}>Repeat password</label>
		<br />
		<input
			bind:value={password2}
			type="password"
			name="password2"
			id="password2-id"
			placeholder="Repeat password"
			class="form-text-input"
			on:click|preventDefault={submit}
		/>

		<br />
		<br />

		<input
			class="form-text-input cursor-pointer bg-neutral-700 hover:bg-neutral-600"
			type="submit"
			value="Register"
			on:click|preventDefault={submit}
		/>
	</form>
</div>
