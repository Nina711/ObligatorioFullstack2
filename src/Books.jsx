import { useSelector } from 'react-redux'
import BookCard from './BookCard'
import Recommendations from './Recommendations'

const Books = () => {
    const books = useSelector(state => state.books.books)
    console.log("BOOKS:", books)

    return (
        <>
            <section className="books-section">
                <h2 className="books-section__title">Mi estantería</h2>
                <div className="divider">— ✦ —</div>

                <div className="books-grid">
                    {books.length > 0
                        ? books.map(book => (
                            <BookCard
                                key={book.id}
                                id={book.id}
                                titulo={book.titulo}
                                autor={book.autor}
                                genero={book.genero}
                                estado={book.estado}
                                descripcion={book.descripcion}
                            />
                        ))
                        : <p className="books-empty">No tienes libros en tu estantería aún.</p>
                    }
                </div>
            </section>
            <Recommendations />
        </>
    )
}

export default Books
