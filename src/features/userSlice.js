import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    id: null,
    rol: null,
    plan: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,

    reducers: {
        setUser: (state, action) => {
            state.id = action.payload.id
            state.rol = action.payload.rol
            state.plan = action.payload.plan
        },

        setPlan: (state, action) => {
            state.plan = action.payload
        },

        logoutUser: (state) => {
            state.id = null
            state.rol = null
            state.plan = null
        }
    }
})

export const {
    setUser,
    setPlan,
    logoutUser
} = userSlice.actions

export default userSlice.reducer