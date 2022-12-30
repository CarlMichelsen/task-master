<script lang="ts">
	import type { Validator } from "../../models/validator";
	import { AuthService } from "../../services/authService";
	import ValidatedTextInput from "./ValidatedTextInput.svelte";

	let username: string = "";
	let email: string = "";
	let fullname: string = "";
	let password1: string = "";
	let password2: string = "";

	let usernameValidationResult: { [name: string]: boolean };
	let emailValidationResult: { [name: string]: boolean };
	let fullnameValidationResult: { [name: string]: boolean };
	let password1ValidationResult: { [name: string]: boolean };
	let password2ValidationResult: { [name: string]: boolean };

	const usernameValidation: Validator = {
		"Not empty": (text) => !!text,
		"Acceptable length": (text) => text.length >= 3 && text.length < 33,
	};

	const emailValidation: Validator = {
		"Not empty": (text) => !!text,
		"Valid Email": (text) =>
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text),
		"Acceptable length": (text) => text.length >= 6 && text.length < 255,
	};

	const fullnameValidation: Validator = {
		"Not empty": (text) => !!text,
	};

	const passwordValidation: Validator = {
		"Not empty": (text) => !!text,
		"Acceptable length": (text) => text.length >= 6 && text.length <= 256,
	};

	const repeatPasswordValidation: Validator = {
		...passwordValidation,
		"Passwords match": (text) => !!text && text === password1,
	};

	const submit = async () => {
		if (password1 !== password2) return;

		const errors = Object.values(usernameValidationResult)
			.concat(Object.values(emailValidationResult))
			.concat(Object.values(fullnameValidationResult))
			.concat(Object.values(password1ValidationResult))
			.concat(Object.values(password2ValidationResult));

		if (errors.includes(false)) return;

		const res = await AuthService.register(
			username,
			fullname,
			email,
			password1
		);

		if (!res.complete) alert(res.errors.join("\n"));
	};
</script>

<div class="mx-auto w-96 mt-6">
	<h2 class="text-xl">Register an account</h2>

	<div>
		<ValidatedTextInput
			bind:value={username}
			bind:validationResult={usernameValidationResult}
			type="text"
			id="username-id"
			placeholder="display-name"
			validation={usernameValidation}
		/>

		<br />

		<ValidatedTextInput
			bind:value={email}
			bind:validationResult={emailValidationResult}
			type="email"
			id="email-id"
			placeholder="email"
			validation={emailValidation}
		/>

		<br />

		<ValidatedTextInput
			bind:value={fullname}
			bind:validationResult={fullnameValidationResult}
			type="text"
			id="fullname-id"
			placeholder="full name"
			validation={fullnameValidation}
		/>

		<br />

		<ValidatedTextInput
			bind:value={password1}
			bind:validationResult={password1ValidationResult}
			type="password"
			id="password1-id"
			placeholder="password"
			validation={passwordValidation}
		/>

		<br />

		<ValidatedTextInput
			bind:value={password2}
			bind:validationResult={password2ValidationResult}
			type="password"
			id="password2-id"
			placeholder="repeat password"
			validation={repeatPasswordValidation}
		/>

		<br />

		<button
			class="form-text-input cursor-pointer bg-neutral-700 hover:bg-neutral-600"
			on:click={submit}>Register</button
		>
	</div>
</div>
