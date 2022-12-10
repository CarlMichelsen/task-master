import "./app.css";
import App from "./App.svelte";
import { AuthService } from "./services/authService";
AuthService.authorize();

const app = new App({
	target: document.getElementById("app"),
});

export default app;
