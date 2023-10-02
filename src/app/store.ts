import { tasksReducer } from "features/TodolistsList/tasks-reducer"
import { todolistsReducer } from "features/TodolistsList/todolists-reducer"
import { AnyAction } from "redux"
import { ThunkAction } from "redux-thunk"
import { appReducer } from "./app-reducer"
import { configureStore } from "@reduxjs/toolkit"
import { authReducer } from "features/Login/auth-reducer"
import {TypedUseSelectorHook, useSelector} from 'react-redux';

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        todolists: todolistsReducer,
        app: appReducer,
        auth: authReducer,
    },
})

export type AppRootStateType = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store
