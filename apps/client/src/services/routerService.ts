export class RouterService {
	public static get route() {
		return this.currentRoute;
	}

	public static set route(newRoute: string) {
		this.currentRoute = newRoute ?? null;
		window.location.hash = newRoute ?? "";
		this.action(newRoute);
	}

	public static set onRouteChange(action: (route: string | null) => void) {
		this.action = action;
	}

	public static init() {
		const full = window.location.hash;
		if (full) {
			this.route = full.substring(1);
		} else {
			this.route = null;
		}
	}

	private static currentRoute: string | null = window.location.hash ?? null;

	private static action: (route: string | null) => void = (route) => {
		console.log("default route action");
	};
}
