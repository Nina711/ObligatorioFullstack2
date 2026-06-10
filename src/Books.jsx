import { useSelector } from 'react-redux'
import BookCard from './BookCard'
import Recommendations from './Recommendations'

const Books = () => {
    const books = useSelector(state => state.books.books)
    const reviews = useSelector(
        state => state.reviews
    )

    return (
        <>
            <section className="books-section">
                <h2 className="books-section__title">Mi estantería</h2>

                <div className="books-grid">
                    {books.length > 0
                        ? books.map(book => {

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
