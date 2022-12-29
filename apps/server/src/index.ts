import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as cors from "cors";

// routes
import routes from "./api";

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
const devCorsOptions: cors.CorsOptions = {
	origin: "http://localhost:3000",
	optionsSuccessStatus: 200,
};

app.use(cors.default(Configuration.production ? undefined : devCorsOptions));

app.use(express.json());

// serve website
const publicDir = path.join(__dirname, "public");
app.use("/", express.static(publicDir, { redirect: true }));

app.use("/api/v1", routes);

// start webserver
const httpServer: http.Server = new http.Server(app);
const websocket = new WebSocketHandler(
	httpServer,
	Configuration.production ? undefined : devCorsOptions
);

console.log("Starting...");
syncDb(async () => {
	httpServer.listen(port, async () => {
		console.log(`Server started on port ${port}`);
		websocket.start();
		startup.setDate(Date.now());
	});
}, Configuration.production); // skip database table sync in dev mode
