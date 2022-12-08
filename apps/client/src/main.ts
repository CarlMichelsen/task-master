import "./app.css";
import App from "./App.svelte";
import { AuthService } from "./services/authService";
AuthService.getIdentity();

const app = new App({
	target: document.getElementById("app"),
});

export default app;
