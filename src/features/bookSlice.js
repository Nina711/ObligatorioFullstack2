import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    books: []
}

export const bookSlice = createSlice({
    name: 'notas',
    initialState,
    reducers: {
        setBooks: (state, action) => {
            state.notas = action.payload
        },
        addBook: (state, action) => {
            console.log(action)
            const newBook = { ...action.payload, id: state.notas.length + 1 }
            console.log(newBook)
            state.books.push(newBook)
        },
        deleteBook: (state, action) => {
            console.log(action.payload)
            state.books = state.books.filter(book => book._id != action.payload)
        },
        updateBook: (state, action) => {
            state.books = state.books.map(book => {
                if (book._id == action.payload.id) {
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