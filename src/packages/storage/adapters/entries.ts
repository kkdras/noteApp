import { IEntry } from "../../../app/reducers";
import storage from "../storage";

async function getEntries(): Promise<IEntry[]> {
	let tmp: null | IEntry[] = JSON.parse(storage.getItem("entries") || "null")
	let returnValue: IEntry[] = tmp || []

	return returnValue
}

async function setEntries<T>(entries: T[]): Promise<void> {
	let tmp = JSON.stringify(entries)
	storage.setItem("entries", tmp)
}

export default {
	getEntries,
	setEntries
}