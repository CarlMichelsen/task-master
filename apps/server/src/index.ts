import * as express from "express";
import * as http from "http";
import * as path from "path";
import { config } from "dotenv";

// endpoints
import healthcheck from "./endpoints/healthcheck";
import auth from "./endpoints/auth";
import allUsers from "./endpoints/allUsers";
import allTaskboards from "./endpoints/allTaskboards";
import createUser from "./endpoints/createUser";
import createTaskboard from "./endpoints/createTaskboard";

// websocket imports
import { WebSocketHandler } from "./websocket/WebSocketHandler";

// load environment variables
config();

const startup = new Date(Date.now());
const app = express.default();
const port = isNaN(Number(process.env.PORT)) ? 80 : Number(process.env.PORT);

app.use(express.json());

// health endpoint
app.get("/health", healthcheck);

// auth endpoint
app.post("/auth", auth);

// allUsers endpoint
app.get("/allUsers", allUsers);

// test createUser endpoint
app.post("/createUser", createUser);

// test createTaskboard endpoint
app.post("/createTaskboard", createTaskboard);

// allTaskboards endpoint
app.get("/allTaskboards", allTaskboards);

// serve website
const publicDir = path.join(__dirname, "public");
app.use("/", express.static(publicDir, { redirect: true }));

// start webserver
const httpServer: http.Server = new http.Server(app);
const websocket = new WebSocketHandler(httpServer);
httpServer.listen(port, () => {
	console.log(`Server started on port ${port}`);
	websocket.start();
	startup.setDate(Date.now());
});
