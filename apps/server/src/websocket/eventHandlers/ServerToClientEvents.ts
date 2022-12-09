import { IServerToClientEvents } from "../eventInterfaces/IServerToClientEvents";

export class ServerToClientEvents implements IServerToClientEvents {
	noArg() {}
	basicEmit(a: number, b: string) {}
	withAck(d: string, callback: (e: number) => void) {}
}
