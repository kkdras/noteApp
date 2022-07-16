export interface IStorage {
	setItem(name: string, value: string): void
	getItem: (name: string) => string | null
}

let storage: IStorage = localStorage

let setItem = (name: string, value: string): void => {
	if (typeof storage.setItem !== "function") {
		throw "Storage must implement setItem method"
	}

	storage.setItem(name, value)
}

let getItem = (name: string): string | null => {
	if (typeof storage.setItem !== "function") {
		throw "Storage must implement setItem method"
	}
	return storage.getItem(name)

}

export default { setItem, getItem }

export const setStorage = (instance: IStorage) => {
	storage = instance
}