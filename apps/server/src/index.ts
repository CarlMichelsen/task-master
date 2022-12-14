import * as express from "express";
import * as http from "http";
import * as path from "path";

// configuration
import { Configuration } from "./configuration";
import { syncDb } from "./database";

// endpoints
import healthcheck from "./endpoints/healthcheck";
import allUsers from "./endpoints/allUsers";
import allTaskboards from "./endpoints/allTaskboards";
import createUser from "./endpoints/createUser";
import createTaskboard from "./endpoints/createTaskboard";

// websocket imports
import { WebSocketHandler } from "./websocket/W8bSocketHandler";

// load environment variables
Configuration.init();

const startup = new Date(Date.now());
const app = express.default();
const port = Configuration.port;

app.use(express.json());

// health endpoint
app.get("/health", healthcheck);

// test createUser endpoint
app.post("/createUser", createUser);

// allUsers endpoint
app.get("/allUsers", allUsers);

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
syncDb(() => {
	httpServer.listen(port, () => {
		console.log(`Server started on port ${port}`);
		websocket.start();
		startup.setDate(Date.now());
	});
});
