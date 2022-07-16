import { IEntry } from "../../../app/reducers";
import storage from "../storage";

function getEntriesCashedData(): { count: number | null } {
	let tmp: { count: number | null } | null = JSON.parse(storage.getItem("entriesCashedDataApi") || "null")
	let returnValue = tmp || { count: null }

	return returnValue
}

function setEntriesCashedData(data: { count: number | null }): void {
	let tmp = JSON.stringify(data)
	storage.setItem("entriesCashedDataApi", tmp)
}

export default {
	getEntriesCashedData,
	setEntriesCashedData
}