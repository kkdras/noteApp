import { getTimeZones } from './../../packages/api/rest/timezone';
import { string } from 'prop-types';
import { entriesApi } from './../../packages/storage/index';
import { ActionType, AppDispatch, GeneralThunkType, RootState } from "../redux-store"
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
			if (action.payload.entry) {
				return {
					...state,
					errorSaveEntry: action.payload.error,
					entries: [action.payload.entry, ...(state.entries || [])]
				}
			}
			return {
				...state,
				errorSaveEntry: action.payload.error
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
		await pendiner()
		try {
			entries = await entriesApi.getEntries()
			error = null
		} catch (e) {
			error = "Произошла ошибка при получении записей"
			entries = null
		}

		let tmp = dispatch(actions.setEntries(error, entries))
		dispatch(actions.togglePendingGetEntries())
		return tmp
	}
}
let pendiner = async () => new Promise(res => setTimeout(() => res(1), 500))

export let createEntry = (text: string, sign: string, tz: string): GeneralThunkType<GeneralActionsType, Promise<ReturnType<typeof actions.setEntry>>> => {
	return async (dispatch, getState) => {
		let entries = getState().entries
		dispatch(actions.togglePendingSaveEntry())
		let error: string | null
		let entry: IEntry | null

		try {
			let timestamp = await getSpecificTimezone(tz.toLowerCase())
			await pendiner()

			if (!entries?.length) {
				entries = await entriesApi.getEntries()
			}

			entry = {
				date: timestamp.datetime,
				sign,
				text,
				entryCounter: `Запись номер ${entries.length + 1}`
			}

			//сохраняем новую запись в localstorage
			await entriesApi.setEntries<IEntry>([entry, ...entries])
			error = null
		} catch (e) {
			error = "Произошла ошибка при сохранении новой записи"
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
			error = "Произошла ошибка при получении временных зон"
		}
		let tmp = dispatch(actions.setTimezones(error, timezones))

		dispatch(actions.togglePendingGetTz())
		return tmp
	}
}
