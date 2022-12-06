import * as express from "express";
import * as dotenv from "dotenv";

// load environment variables
dotenv.config();

const app = express.default();
const port = isNaN(Number(process.env.PORT)) ? 8080 : Number(process.env.PORT);

// serve website
app.use(express.static("public"));

// test endpoint
app.get("/test", (req: express.Request, res: express.Response) => {
	res.send({ test: "yes" });
	console.log("test");
});

// start webserver
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
