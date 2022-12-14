import * as express from "express";
import * as http from "http";
import * as path from "path";

// configuration
import { Configuration } from "./configuration";
import { syncDb } from "./database";

// websocket imports
import { WebSocketHandler } from "./websocket/webSocketHandler";

// load environment variables
Configuration.init();

const startup = new Date(Date.now());
const app = express.default();
const port = Configuration.port;

app.use(express.json());

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
