import storage from "../storage";

async function getEntries<T>(): Promise<T[] | null> {
	let tmp = storage.getItem("entries")
	return (tmp ? JSON.parse(tmp) : null)
}

async function setEntries<T>(entries: T[]): Promise<void> {
	let tmp = JSON.stringify(entries)
	storage.setItem("entries", tmp)
}

export default {
	getEntries,
	setEntries
}