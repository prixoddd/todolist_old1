import {todolistsAPI, TodolistType} from "api/todolists-api"
import {appActions, RequestStatusType} from "app/app-reducer"
import {handleServerNetworkError} from "utils/error-utils"
import {AppThunk} from "app/store"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"

const slice = createSlice({
    name: "todolist",
    initialState: [] as TodolistDomainType[],
    reducers: {
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
        },
        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index != -1) state.splice(index, 1)
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const todolist = state.find(todo => todo.id === action.payload.id)
            if (todolist) {
                todolist.title = action.payload.title
            }
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const todolist = state.find(todo => todo.id === action.payload.id)
            if (todolist) {
                todolist.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
            const todolist = state.find(todo => todo.id === action.payload.id)
            if (todolist) {
                todolist.entityStatus = action.payload.entityStatus
            }
        },
        setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        clearState: () => {
            return []
        }
    },
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export type todolistInitialState = ReturnType<typeof slice.getInitialState>
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}


// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}))
        todolistsAPI
            .getTodolists()
            .then((res) => {
                dispatch(todolistsActions.setTodolists({todolists: res.data}))
                dispatch(appActions.setAppStatus({status: "succeeded"}))
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}))
        dispatch(todolistsActions.changeTodolistEntityStatus({id: todolistId, entityStatus: 'loading'
        }))
        todolistsAPI.deleteTodolist(todolistId).then((res) => {
            dispatch(todolistsActions.removeTodolist({id: todolistId}))
            dispatch(appActions.setAppStatus({status: "succeeded"}))
        })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}))
        todolistsAPI.createTodolist(title).then((res) => {
            dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
            dispatch(appActions.setAppStatus({status: "succeeded"}))
        })
    }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(id, title).then((res) => {
            dispatch(todolistsActions.changeTodolistTitle({id, title}))
        })
    }
}