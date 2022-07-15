import { createStore, applyMiddleware, Action, compose } from 'redux'
import thunk, { ThunkAction } from 'redux-thunk'
import rootReducer from './reducers/index'

const composeEnhancers = (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch



export type ActionType<T extends { [key: string]: (...arg: any[]) => any }> = ReturnType<T extends { [key: string]: infer U } ? U : never>

export type GeneralThunkType<A extends Action, ReturnT = Promise<void>> = ThunkAction<ReturnT, RootState, unknown, A>