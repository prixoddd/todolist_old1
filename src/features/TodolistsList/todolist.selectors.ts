import { AppRootStateType } from "app/store"

export const SelectTodolists = (state: AppRootStateType) => state.todolists
export const SelectTasks = (state: AppRootStateType) => state.tasks
export const SelectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn
