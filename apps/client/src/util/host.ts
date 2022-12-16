export const host = () => {
	return process.env.NODE_ENV === "production"
		? `${location.protocol}//${location.hostname}`
		: "http://localhost:80";
};
