import { writable } from "svelte/store";
import type { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";

export const TaskboardStore = writable<ClientTaskboard | null>(null);
