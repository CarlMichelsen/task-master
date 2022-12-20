import { getParameters } from "./getParameters";

export enum Page {
	Home,
	Taskboard,
}

export interface RouteInformation {
	currentPage: Page;
	taskboard?: string;
}

export const router = (): RouteInformation => {
	const parameters = getParameters(window.location.search);
	const pageString = parameters.get("p");
	const pageNumber = isNaN(Number(pageString)) ? Page.Home : Number(pageString);
	const pageValue = (!!Page[pageNumber] ? pageNumber : Page.Home) as Page;
	if (pageValue === Page.Home) parameters.delete("p");

	let taskboard: string = parameters.get("t");

	const routeInfo: RouteInformation = {
		currentPage: pageValue,
		taskboard: pageValue === Page.Taskboard ? taskboard : undefined,
	};

	return routeInfo;
};
