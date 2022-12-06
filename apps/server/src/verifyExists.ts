import fs from "fs";

export default (path: string) => {
	return fs.existsSync(path);
};
