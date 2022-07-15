import { getTimeZones } from './../../packages/api/rest/timezone';
import { string } from 'prop-types';
import { entriesApi } from './../../packages/storage/index';
import { ActionType, AppDispatch, GeneralThunkType, RootState } from "../redux-store"
import { getSpecificTimezone, ISpecificTimezone } from '../../packages/api/rest/timezone';


interface IEntries {
	setEntries: (entries: string[]) => Promise<void>
	getEntries: () => Promise<string[] | null>
}

let rootEntries: IEntries = entriesApi

interface IEntry {
	text: string,
	sign: string,
	tz: string
	date: ISpecificTimezone
}

interface IInitialState {
	entries: IEntry[] | null
	errorGetEntries: null | string
	errorSaveEntry: null | string
	pendingSaveEntry: boolean
	timeZones: string[] | null
	pendingGetTz: boolean
	errorGetTz: string | null
}

let initialState: IInitialState = {
	entries: [],
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
				entries: [action.payload.entry, ...state.entries]
			}
		case "APP/togglePendingGetTz":
			return {
				...state,
				pendingGetTz: !state.pendingGetTz
			}
	}

	return state
}

let actions = {
	setEntries: (error: string | null, entries: IEntry[] | null) =>
		({ type: "APP/setEntries", payload: { entries, error } } as const),
	togglePendingSaveEntry: () => ({ type: "APP/togglePendingSaveEntry", payload: {} } as const),
	setEntry: (error: string | null, entry: IEntry | null) => ({ type: "APP/setEntry", payload: { error, entry } } as const),
	togglePendingGetTz: () => ({ type: "APP/togglePendingGetTz", payload: {} } as const),
	setTimezones: (error: string | null, tz: string[] | null) => ({ type: "APP/setTimezones", payload: { error, tz } } as const)
}



let getEntries = (): GeneralThunkType<GeneralActionsType, Promise<ReturnType<typeof actions.setEntries>>> => {
	return async (dispatch: AppDispatch) => {
		let entries: IEntry[] | null
		let error: string | null
		try {
			entries = await entriesApi.getEntries<IEntry>()
		} catch (e) {
			error = "Произошла ошибка при получении записей"
		}

		return dispatch(actions.setEntries(error, entries))
	}
}


let saveEntry = (text: string, sign: string, tz: string): GeneralThunkType<GeneralActionsType, Promise<ReturnType<typeof actions.setEntry>>> => {
	return async (dispatch: AppDispatch, getState) => {
		let entries = getState().entries
		actions.togglePendingSaveEntry()
		let error: string | null = null
		let entry: IEntry | null
		try {
			let timestamp = await getSpecificTimezone(tz.toLowerCase())
			entry = {
				date: timestamp,
				sign,
				text,
				tz
			}

			//сохраняем новыю запись в localstorage
			await entriesApi.setEntries<IEntry>([entry, ...entries])
		} catch (e) {
			error = "Произошла ошибка при сохранении новой записи"
			entry = null
		}
		actions.togglePendingSaveEntry()
		let tmp = dispatch(actions.setEntry(error, entry))
		return tmp
	}
}

let getTimezones = (): GeneralThunkType<GeneralActionsType, Promise<ReturnType<typeof actions.setTimezones>>> => {
	return async (dispatch: AppDispatch) => {
		let timezones: string[] | null = null
		let error: string | null = null
		actions.togglePendingGetTz()
		try {
			timezones = await getTimeZones()
		} catch (e) {
			error = "Произошла ошибка при получении временных зон"
		}
		let tmp = dispatch(actions.setTimezones(error, timezones))

		actions.togglePendingGetTz()
		return tmp
	}
}
