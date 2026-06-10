import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    books: []
}

export const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        setBooks: (state, action) => {
            state.books = action.payload
        },
        addBook: (state, action) => {
            const newBook = { ...action.payload}
        },
        deleteBook: (state, action) => {
            state.books = state.books.filter(book => book.id != action.payload)
        },
        updateBook: (state, action) => {
            state.books = state.books.map(book => {
                if (book.id == action.payload.id) {
                    book = { ...book, ...action.payload.modificado }    
                }

                return book
            })
        }
    }
})

export const {
    setBooks,
    addBook,
    deleteBook,
    updateBook
} = bookSlice.actions

export default bookSlice.reducer