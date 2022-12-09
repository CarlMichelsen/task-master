import { io, Socket } from "socket.io-client";

export class WebsocketService {
	static io: Socket | null = null;
	static ready: boolean = true;

	static connect(userId: string) {
		this.io = io(undefined, {
			auth: { userId },
		});
	}
}
