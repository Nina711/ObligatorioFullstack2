import { useSelector } from 'react-redux'
import BookCard from './BookCard'
import Recommendations from './Recommendations'
import BookFilters from './BookFilters'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setBooks } from './features/bookSlice'
import { API_URL } from './config'

const Books = () => {
    const books = useSelector(state => state.books.books)
    const reviews = useSelector(
        state => state.reviews
    )
    const [filters, setFilters] = useState({
        titulo: '',
        autor: '',
        genero: '',
        estado: '',
        rating: ''
    })
    const dispatch = useDispatch()

    useEffect(() => {

        const timeout = setTimeout(() => {
            const obtenerLibrosFiltrados = async () => {

                try {

                    const params = new URLSearchParams()

                    params.append('limite', 50)
                    params.append('pagina', 1)

                    if (filters.titulo) {
                        params.append('titulo', filters.titulo)
                    }

                    if (filters.autor) {
                        params.append('autor', filters.autor)
                    }

                    if (filters.genero) {
                        params.append('genero', filters.genero)
                    }

                    if (filters.estado) {
                        params.append('estado', filters.estado)
                    }

                    const res = await fetch(
                        `${API_URL}/v1/libros?${params.toString()}`,
                        {
                            headers: {
                                Authorization:
                                    localStorage.getItem('token')
                            }
                        }
                    )

                    if (!res.ok) {
                        throw new Error()
                    }

                    const data = await res.json()

                    dispatch(
                        setBooks(data.libro)
                    )

                } catch {
                    console.log('Error filtrando libros')
                }

            }

            obtenerLibrosFiltrados()
        }, 400)

        return () => clearTimeout(timeout)

    }, [filters, dispatch])

    const filteredBooks = books.filter(book => {

        if (!filters.rating) {
            return true
        }

        const review = reviews.find(
            review => review.idLibro === book.id
        )

        return (
            review?.calificacion ===
            Number(filters.rating)
        )

    })

    return (
        <>
            <section className="books-section">
                <BookFilters
                    filters={filters}
                    setFilters={setFilters}
                />
                <h2 className="books-section__title">Mi estantería</h2>

                <div className="books-grid">
                    {filteredBooks.length > 0
                        ? filteredBooks.map(book => {

                            const review = reviews.find(
                                review => review.idLibro === book.id
                            )
                            return (
                                <BookCard
                                    key={book.id}
                                    id={book.id}
                                    titulo={book.titulo}
                                    autor={book.autor}
                                    genero={book.genero}
                                    estado={book.estado}
                                    descripcion={book.descripcion}
                                    review={review}
                                />
                            )
                        })
                        : <p className="books-empty">No tienes libros en tu estantería aún.</p>
                    }
                </div>
            </section>
            <Recommendations />
        </>
    )
}

export default Books
