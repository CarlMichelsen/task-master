import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";

import {
	AuthValidationService,
	ValidationResult,
} from "./authValidationService";
import { DbAccountService } from "./dbAccountService";
import { DbUserService } from "./dbUserService";

import { Configuration } from "../configuration";
import { UserAttributes } from "../database/models/user";
import { AccountAttributes } from "../database/models/account";

import { RegisterRequest } from "models/auth/registerRequest";
import { AuthResponse } from "models/auth/authResponse";
import { AuthRequest } from "models/auth/authRequest";

export interface JwtClaims extends JwtPayload {
	userId: string;
	accountId: string;
	username: string;
	email: string;
	email_verified: boolean;
}

export class AuthService {
	private accountService = new DbAccountService();
	private userService = new DbUserService();
	private valid = new AuthValidationService(
		this.accountService,
		this.userService
	);

	public async login(loginRequest: AuthRequest): Promise<AuthResponse> {
		const loginFailedText = "Login failed";
		const { email, password } = loginRequest;
		const res: AuthResponse = {
			complete: false,
			errors: [],
			jwt: null,
		};

		const validEmail = await this.valid.validateEmail(email);
		const validPass = await this.valid.validatePassword(password);

		res.errors = res.errors.concat(validEmail.errors).concat(validPass.errors);

		if (res.errors.length > 0) {
			res.complete = false;
			return res;
		}

		const account = await this.accountService.getAccountByEmail(email);

		if (!account) {
			res.errors.push(loginFailedText);
			res.complete = false;
			return res;
		}

		const hash = crypto
			.pbkdf2Sync(password, account.passwordSalt, 1000, 64, "sha512")
			.toString("hex");

		if (hash === account.passwordHash) {
			const user = await this.userService.getUserByAccountId(account.id);
			if (!user) {
				res.errors.push(
					"Failed to find user associated with the login account"
				);
				return res;
			}
			res.jwt = this.createToken(account, user);
			res.complete = true;
			console.log(`"${user.username}" logged in with email ${account.email}`);
			return res;
		}

		res.errors.push(loginFailedText);
		return res;
	}

	public authenticate(jwtToken: string): JwtClaims | null {
		if (!jwtToken) return null;
		const decoded = jwt.verify(jwtToken, Configuration.authorizationSecret);
		return decoded ? (decoded as JwtClaims) : null;
	}

	public async register(request: RegisterRequest): Promise<AuthResponse> {
		const res: AuthResponse = {
			complete: false,
			errors: [],
			jwt: null,
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

		const createdAccount = await this.accountService.createAccount(account);

		if (createdAccount) {
			const user: UserAttributes = {
				id: uuidv4(),
				username: request.username,
				account_id: account.id,
				online: false,
			};
			const createdUser = await this.userService.createUser(user);

			if (!createdUser)
				throw new Error(
					"Failed to create account-user pair during registration"
				);

			res.jwt = this.createToken(account, user);
			res.complete = true;
			console.log(
				`"New registration by ${user.username}" with email "${account.email}"`
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
			expiresIn: "12h",
		});

		return token;
	}
}
