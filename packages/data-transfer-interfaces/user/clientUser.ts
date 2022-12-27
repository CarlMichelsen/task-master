export interface ClientAccount {
	fullName: string;
	email: string;
	emailVerified: boolean; // TODO: add email verification
	phoneNumber?: string; // TODO: add phone number
	phoneNumberVerified?: boolean; // TODO: add phone number verification
}

export interface ClientUser {
	id: string;
	username: string;
	imageSeed: string;
	upvotes: number;
	accountData?: ClientAccount;
	online: boolean;
}
