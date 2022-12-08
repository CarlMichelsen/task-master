export const id2uri = (id: string) => {
	const hexString = id.replace(/-/g, "");
	const base64String = Buffer.from(hexString, "hex").toString("base64");
	return base64String;
};
