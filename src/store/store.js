import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../features/bookSlice";
import userReducer from "../features/userSlice";
import reviewReducer from "../features/reviewSlice"

export const store = configureStore({
    reducer: {
        books: booksReducer,
        user: userReducer,
        reviews: reviewReducer
    },
});