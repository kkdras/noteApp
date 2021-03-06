import { getTimeZones } from './../../packages/api/rest/timezone';
import { entriesApi } from './../../packages/storage/index';
import { ActionType, GeneralThunkType } from "../redux-store"
import { getSpecificTimezone, ISpecificTimezone } from '../../packages/api/rest/timezone';


interface IEntriesApi {
	setEntries: (entries: IEntry[]) => Promise<void>
	getEntries: () => Promise<IEntry[]>
}

let rootEntries: IEntriesApi = entriesApi

export interface IEntry {
	text: string
	sign: string
	date: ISpecificTimezone["datetime"]
	entryCounter: string
}

interface IInitialState {
	entries: IEntry[] | null
	pendingGetEntries: boolean
	errorGetEntries: null | string
	errorSaveEntry: null | string
	pendingSaveEntry: boolean
	timeZones: string[] | null
	pendingGetTz: boolean
	errorGetTz: string | null
}

let initialState: IInitialState = {
	entries: null,
	pendingGetEntries: false,
	errorGetEntries: null,
	errorSaveEntry: null,
	pendingSaveEntry: false,
	timeZones: null,
	pendingGetTz: false,
	errorGetTz: null
}

type GeneralActionsType = ActionType<typeof actions>

export default (state = initialState, action: GeneralActionsType): IInitialState => {
	switch (action.type) {
		case "APP/setEntries":
			return {
				...state,
				entries: action.payload.entries,
				errorGetEntries: action.payload.error
			}
		case "APP/togglePendingSaveEntry":
			return {
				...state,
				pendingSaveEntry: !state.pendingSaveEntry
			}
		case "APP/setEntry":
			return {
				...state,
				errorSaveEntry: action.payload.error,
				entries: action.payload.entry ? [action.payload.entry, ...(state.entries || [])] : state.entries,
			}
		case "APP/togglePendingGetTz":
			return {
				...state,
				pendingGetTz: !state.pendingGetTz
			}
		case "APP/setSaveEntryErrorStatus":
			return {
				...state,
				errorSaveEntry: action.payload.error
			}
		case "APP/setTimezones":
			return {
				...state,
				timeZones: action.payload.tz,
				errorGetTz: action.payload.error
			}
		case "APP/setGetTzError":
			return {
				...state,
				errorGetTz: action.payload.error
			}
		case "APP/togglePendingGetEntries":
			return {
				...state,
				pendingGetEntries: !state.pendingGetEntries
			}
	}
	return state
}

export let actions = {
	setEntries: (error: string | null, entries: IEntry[] | null) =>
		({ type: "APP/setEntries", payload: { entries, error } } as const),
	setSaveEntryError: (error: string | null) =>
		({ type: "APP/setSaveEntryErrorStatus", payload: { error } } as const),
	setGetTzError: (error: string | null) =>
		({ type: "APP/setGetTzError", payload: { error } } as const),
	togglePendingSaveEntry: () =>
		({ type: "APP/togglePendingSaveEntry", payload: {} } as const),
	setEntry: (error: string | null, entry: IEntry | null) =>
		({ type: "APP/setEntry", payload: { error, entry } } as const),
	togglePendingGetTz: () =>
		({ type: "APP/togglePendingGetTz", payload: {} } as const),
	setTimezones: (error: string | null, tz: string[] | null) =>
		({ type: "APP/setTimezones", payload: { error, tz } } as const),
	togglePendingGetEntries: () =>
		({ type: "APP/togglePendingGetEntries", payload: {} } as const),

}



export let getEntries = (): GeneralThunkType<GeneralActionsType, Promise<ReturnType<typeof actions.setEntries>>> => {
	return async (dispatch) => {
		let entries: IEntry[] | null
		let error: string | null
		dispatch(actions.togglePendingGetEntries())
		try {
			entries = await entriesApi.getEntries()
			error = null
		} catch (e) {
			error = "?????????????????? ???????????? ?????? ?????????????????? ??????????????"
			entries = null
		}

		let tmp = dispatch(actions.setEntries(error, entries))
		dispatch(actions.togglePendingGetEntries())
		return tmp
	}
}

export let createEntry = (text: string, sign: string, tz: string): GeneralThunkType<GeneralActionsType, Promise<ReturnType<typeof actions.setEntry>>> => {
	return async (dispatch, getState) => {
		let entries = getState().entries
		dispatch(actions.togglePendingSaveEntry())
		let error: string | null
		let entry: IEntry | null

		try {
			let timestamp = await getSpecificTimezone(tz.toLowerCase())

			if (!entries?.length) {
				entries = await entriesApi.getEntries()
			}

			entry = {
				date: timestamp.datetime,
				sign,
				text,
				entryCounter: `???????????? ?????????? ${entries.length + 1}`
			}

			//save the new entry in localstorage
			await entriesApi.setEntries<IEntry>([entry, ...entries])
			error = null
		} catch (e) {
			error = "?????????????????? ???????????? ?????? ???????????????????? ?????????? ????????????"
			entry = null
		}
		dispatch(actions.togglePendingSaveEntry())
		let tmp = dispatch(actions.setEntry(error, entry))
		return tmp
	}
}

export let getTimezones = (): GeneralThunkType<GeneralActionsType, Promise<ReturnType<typeof actions.setTimezones>>> => {
	return async (dispatch) => {
		let timezones: string[] | null = null
		let error: string | null = null
		dispatch(actions.togglePendingGetTz())

		try {
			timezones = await getTimeZones()
		} catch (e) {
			timezones = null
			error = "?????????????????? ???????????? ?????? ?????????????????? ?????????????????? ??????"
		}
		let tmp = dispatch(actions.setTimezones(error, timezones))

		dispatch(actions.togglePendingGetTz())
		return tmp
	}
}
