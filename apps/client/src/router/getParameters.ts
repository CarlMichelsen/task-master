export const getParameters = (search: string): Map<string, string> => {
	const map = new Map<string, string>();
	const str = search.includes("?")
		? document.location.search.substring(1)
		: null;
	if (!str) return map;
	const list = str.split("&");

	for (let item of list) {
		const firstEqual = item.indexOf("=");
		if (firstEqual === -1) {
			map.set(item, null);
			continue;
		}
		const key = item.substring(0, firstEqual);
		const value = item.substring(firstEqual + 1);
		map.set(key, value);
	}

	return map;
};
