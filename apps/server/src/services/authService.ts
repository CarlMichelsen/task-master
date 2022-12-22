import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";

import {
	AuthValidationService,
	ValidationResult,
} from "./authValidationService";
import { AccountRepository } from "../repositories/accountRepository";
import { UserRepository } from "../repositories/userRepository";

import { Configuration } from "../configuration";
import { UserAttributes } from "../database/models/user";
import { AccountAttributes } from "../database/models/account";

import { RegisterRequest } from "data-transfer-interfaces/auth/registerRequest";
import { AuthResponse } from "data-transfer-interfaces/auth/authResponse";
import { AuthRequest } from "data-transfer-interfaces/auth/authRequest";
import { ClientUser } from "data-transfer-interfaces/user/clientUser";

export interface JwtClaims extends JwtPayload {
	userId: string;
	accountId: string;
	username: string;
	email: string;
	email_verified: boolean;
}

export class AuthService {
	private accountRepository = new AccountRepository();
	private userRepository = new UserRepository();
	private valid = new AuthValidationService(
		this.accountRepository,
		this.userRepository
	);

	public async login(loginRequest: AuthRequest): Promise<AuthResponse> {
		const loginFailedText = "Login failed";
		const { email, password } = loginRequest;
		const res: AuthResponse = {
			complete: false,
			errors: [],
			jwt: null,
			user: null,
		};

		const validEmail = await this.valid.validateEmail(email);
		const validPass = await this.valid.validatePassword(password);

		res.errors = res.errors.concat(validEmail.errors).concat(validPass.errors);

		if (res.errors.length > 0) {
			res.complete = false;
			return res;
		}

		const account = await this.accountRepository.getAccountByEmail(email);

		if (!account) {
			res.errors.push(loginFailedText);
			res.complete = false;
			return res;
		}

		const hash = crypto
			.pbkdf2Sync(password, account.passwordSalt, 1000, 64, "sha512")
			.toString("hex");

		if (hash === account.passwordHash) {
			const user = await this.userRepository.getUserByAccountId(account.id);
			if (!user) {
				res.errors.push(
					"Failed to find user associated with the login account"
				);
				return res;
			}
			res.jwt = this.createToken(account, user);
			res.user = this.getClientUserFromUser(user);
			res.complete = true;
			console.log(`"${user.username}" logged in with email ${account.email}`);
			return res;
		}

		res.errors.push(loginFailedText);
		return res;
	}

	public authenticate(jwtToken: string): JwtClaims | null {
		if (!jwtToken) return null;
		const decoded = jwt.verify(jwtToken, Configuration.authorizationSecret, {
			algorithms: ["HS512"],
		});
		return decoded ? (decoded as JwtClaims) : null;
	}

	public async register(request: RegisterRequest): Promise<AuthResponse> {
		const res: AuthResponse = {
			complete: false,
			errors: [],
			jwt: null,
			user: null,
		};

		const validation = await this.registerRequestValidation(request);
		if (!validation.ok) {
			res.errors = validation.errors;
			return res;
		}

		const hashSaltPair = this.hashSaltPair(request.password);

		const account: AccountAttributes = {
			id: uuidv4(),
			fullname: request.fullname,
			email: request.email,
			passwordHash: hashSaltPair.hash,
			passwordSalt: hashSaltPair.salt,
			email_verified: false,
		};

		const createdAccount = await this.accountRepository.createAccount(account);

		if (createdAccount) {
			const user: UserAttributes = {
				id: uuidv4(),
				username: request.username,
				account_id: account.id,
				upvotes: 0,
				online: false,
			};
			const createdUser = await this.userRepository.createUser(user);

			if (!createdUser) {
				const cleanedUp = await this.accountRepository.deleteAccountById(
					account.id
				);
				const errMsg = cleanedUp
					? "Account was deleted again"
					: `Failed to delete the account. There is now an orphan account in exsistence ${account.id}`;

				throw new Error(
					`Failed to create user for account during registration. ${errMsg}`
				);
			}

			res.jwt = this.createToken(account, user);
			res.user = this.getClientUserFromUser(user);
			res.complete = true;
			console.log(
				`New registration by "${user.username}" with email "${account.email}!`
			);
			return res;
		}

		res.errors.push("Registration failed");
		return res;
	}

	private hashSaltPair(password: string): { hash: string; salt: string } {
		const salt = crypto.randomBytes(16).toString("hex");
		const hash = crypto
			.pbkdf2Sync(password, salt, 1000, 64, "sha512")
			.toString("hex");
		return { hash, salt };
	}

	// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
	private getClientUserFromUser(user: UserAttributes): ClientUser {
		return {
			username: user.username,
			online: user.online,
		};
	}

	private async registerRequestValidation(
		request: RegisterRequest
	): Promise<ValidationResult> {
		const res = new ValidationResult();

		const promises: Promise<ValidationResult>[] = [
			this.valid.validateUsername(request.username, true),
			this.valid.validateEmail(request.email, true),
			this.valid.validateFullname(request.fullname),
			this.valid.validatePassword(request.password),
		];
		const results = await Promise.all(promises);

		results.forEach((val) => (res.errors = res.errors.concat(val.errors)));
		return res;
	}

	private createToken(
		account: AccountAttributes,
		user: UserAttributes
	): string {
		if (account.id !== user.account_id)
			throw new Error("Account user mismatch during authentication");

		const claims: JwtClaims = {
			userId: user.id,
			accountId: account.id,
			username: user.username,
			email: account.email,
			email_verified: account.email_verified,
		};

		const token = jwt.sign(claims, Configuration.authorizationSecret, {
			algorithm: "HS512",
			expiresIn: "12h",
		});

		return token;
	}
}
