import { io, Socket } from "socket.io-client";

export class WebsocketService {
	static io: Socket | null = null;
	static ready: boolean = true;

	static connect(userId: string) {
		const hostname = `${location.protocol}//${location.hostname}`;
		console.log(hostname);
		this.io = io(hostname, {
			auth: { userId },
			path: "/socket",
		});
	}
}
