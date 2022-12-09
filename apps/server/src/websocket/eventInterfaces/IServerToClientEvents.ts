export interface IServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
}
