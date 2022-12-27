import { writable } from "svelte/store";
import type { ClientData } from "../../models/clientData";

export const ClientDataStore = writable<ClientData | null>(null);
