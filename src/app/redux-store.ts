import { Dispatch } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createStore, applyMiddleware, Action, compose, AnyAction } from 'redux'
import thunkMiddleware, { ThunkAction, ThunkDispatch } from 'redux-thunk'
import rootReducer from './reducers/index'

//const composeEnhancers = (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, applyMiddleware<DispatchFunctionType, ReturnType<typeof rootReducer>>(thunkMiddleware))

type DispatchFunctionType = ThunkDispatch<ReturnType<typeof rootReducer>, undefined, AnyAction>

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()

export let useTypesSelector: TypedUseSelectorHook<RootState> = useSelector

export type ActionType<T extends { [key: string]: (...arg: any[]) => any }> = ReturnType<T extends { [key: string]: infer U } ? U : never>

export type GeneralThunkType<A extends Action, ReturnT = Promise<void>> = ThunkAction<ReturnT, RootState, unknown, A>