import { useSelector } from 'react-redux'
import BookCard from "./BookCard"


const Books = () => {

    const books = useSelector(state => state.books.books)

    return (
        <section className="books">
            <h2>Mis libros</h2>
            <div className="books__grid">
                {books.length > 0 ?
                    books.map(books => <BookCard key={book._id} id={book._id} titulo={book.titulo} author={book.author} state={book.state} />)
                    :
                    <p>No tienes libros agregados</p>
                }
            </div>
        </section>
    )
}

export default Books