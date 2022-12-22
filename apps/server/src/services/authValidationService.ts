import { AccountRepository } from "../repositories/accountRepository";
import { UserRepository } from "../repositories/userRepository";

export class ValidationResult {
	get ok() {
		return this.errors.length === 0;
	}
	errors: string[] = [];
}

export class AuthValidationService {
	private accountRepository: AccountRepository;
	private userRepository: UserRepository;

	constructor(
		accountRepository: AccountRepository,
		userRepository: UserRepository
	) {
		this.accountRepository = accountRepository;
		this.userRepository = userRepository;
	}

	public async validatePassword(password: string): Promise<ValidationResult> {
		const res = new ValidationResult();

		if (!password) {
			res.errors.push("No password");
			return res;
		}

		if (password.length <= 6) {
			res.errors.push("Password must be longer than 6 characters");
		}

		return res;
	}

	public async validateUsername(
		username: string,
		registering: boolean = false
	): Promise<ValidationResult> {
		const res = new ValidationResult();

		if (!username) {
			res.errors.push("No username");
			return res;
		}

		if (username.length <= 2) {
			res.errors.push("Username must be longer than 2 characters");
		}

		if (!registering) return res; // the rest of the validation is only relevant for registration

		const exsists = await this.userRepository.usernameExists(username);
		if (exsists) {
			res.errors.push("Username already registered");
			return res;
		}

		return res;
	}

	public async validateEmail(
		email: string,
		registering: boolean = false
	): Promise<ValidationResult> {
		const res = new ValidationResult();

		if (!email) {
			res.errors.push("No email");
			return res;
		}

		if (email.length <= 6) {
			res.errors.push("Email must be at least 6 characters long");
		}

		if (email.length >= 255) {
			res.errors.push("Email must be shorter than 255 characters");
		}

		if (!email.includes("@")) {
			res.errors.push('Email must contain "@"');
			return res;
		}

		const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (!reg.test(email)) {
			res.errors.push("Email is invalid");
			return res;
		}

		if (!registering) return res; // the rest of the validation is only relevant for registration

		const account = await this.accountRepository.getAccountByEmail(email);
		if (account) {
			res.errors.push("Email already registered");
			return res;
		}

		return res;
	}

	public async validateFullname(fullname: string): Promise<ValidationResult> {
		const res = new ValidationResult();

		if (!fullname) {
			res.errors.push("No fullname");
			return res;
		}

		if (fullname.length <= 3) {
			res.errors.push("Fullname must be at least 3 characters long");
		}

		return res;
	}
}
