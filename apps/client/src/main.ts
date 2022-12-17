import "./app.css";
import axios from "axios";
import { host } from "./util/host";
import App from "./App.svelte";

axios.defaults.baseURL = host();

const app = new App({
	target: document.getElementById("app"),
});

export default app;
