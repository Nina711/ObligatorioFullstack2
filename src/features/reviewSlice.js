import { createSlice } from '@reduxjs/toolkit'

const reviewSlice = createSlice({
    name: 'reviews',

    initialState: [],

    reducers: {

        setReviews: (state, action) => {
            return action.payload
        },

        addReview: (state, action) => {
            state.push(action.payload)
        },

        deleteReview: (state, action) => {
            return state.filter(
                review => review.id !== action.payload
            )
        }

    }
})

export const {
    setReviews,
    addReview,
    deleteReview
} = reviewSlice.actions

export default reviewSlice.reducer