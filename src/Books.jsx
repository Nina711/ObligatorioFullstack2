import { useSelector } from 'react-redux'
import BookCard from './BookCard'

const Books = () => {
    const books = useSelector(state => state.books.books)

    return (
        <section className="books-section">
            <h2 className="books-section__title">Mi Colección</h2>
            <div className="divider">— ✦ —</div>

            <div className="books-grid">
                {books.length > 0
                    ? books.map(book => (
                        <BookCard
                            key={book._id}
                            id={book._id}
                            titulo={book.titulo}
                            autor={book.autor}
                            genero={book.genero}
                            estado={book.estado}
                        />
                    ))
                    : <p className="books-empty">No tienes libros en tu colección aún.</p>
                }
            </div>
        </section>
    )
}

export default Books
