import express from "express";
import path from "path";
import { config } from "dotenv";

// endpoints
import healthcheck from "./endpoints/healthcheck";
import auth from "./endpoints/auth";
import allUsers from "./endpoints/allUsers";
import allTaskboards from "./endpoints/allTaskboards";
import createUser from "./endpoints/createUser";

// load environment variables
config();

const startup = new Date(Date.now());
const app = express();
const port = isNaN(Number(process.env.PORT)) ? 80 : Number(process.env.PORT);

app.use(express.json());

// health endpoint
app.get("/health", healthcheck);

// auth endpoint
app.get("/auth", auth);

// allUsers endpoint
app.get("/allUsers", allUsers);

// test createUser endpoint
app.post("/createUser", createUser);

// allTaskboards endpoint
app.get("/allTaskboards", allTaskboards);

// serve website
const publicDir = path.join(__dirname, "public");
app.use("/", express.static(publicDir, { redirect: true }));

// start webserver
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
	startup.setDate(Date.now());
});
