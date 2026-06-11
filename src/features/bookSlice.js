import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    books: [],
    pagination: {
        total: 0,
        totalPaginas: 1
    }
}

export const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        setBooks: (state, action) => {
            state.books = action.payload.books
            state.pagination = {total: action.payload.total, totalPaginas: action.payload.totalPaginas}
        },
        addBook: (state, action) => {
            const newBook = { ...action.payload}
            state.books.push(newBook)
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