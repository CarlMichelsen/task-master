export const createCookie = (name: string,value :string, days:number): string => {
	let expires = "";
    if (!!days) {
		const date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toUTCString();
	}
  const wholeCookie = `${name}=${value};SameSite=None;Secure${expires}`;
	document.cookie = wholeCookie;
  return wholeCookie;
}

export const readCookie = (name: string): string|null => {
	const nameEQ = name + "=";
	const ca = document.cookie.split(';');
	for(let i=0; i < ca.length; i++) {
		const c = ca[i].trim();
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

export const eraseCookie = (name: string): void => {
    createCookie(name,"",-1);
}