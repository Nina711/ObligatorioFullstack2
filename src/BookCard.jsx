import { useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { deleteBook, updateBook } from "./features/bookSlice"

const BookCard = ({ id, titulo, author, state }) => {
    const dispatch = useDispatch()
    const [editing, setEditing] = useState(false)

    const inputTituloRef = useRef()
    const inputAuthorRef = useRef()
    const inputStateRef  = useRef()

    const handleSave = () => {
        const newTitulo = inputTituloRef.current.value
        const newAuthor = inputAuthorRef.current.value

        if (!newTitulo || !newAuthor) {
            alert("Título y autor son obligatorios")
            return
        }

        dispatch(updateBook({
            id,
            modificado: {
                titulo: newTitulo,
                author: newAuthor,
                state: inputStateRef.current.value,
            }
        }))
        setEditing(false)
    }

    const handleDelete = () => {
        fetch(`https://notas-app-backend.vercel.app/v1/notas/${id}`, {
            method: "DELETE",
            headers: { Authorization: localStorage.getItem('token') },
        }).then(res => {
            if (res.ok) dispatch(deleteBook(id))
            else alert("No se pudo eliminar el libro")
        })
    }

    if (!editing) {
        return (
            <article className="book-card">
                <div className="book-card__spine"></div>
                <div className="book-card__body">
                    <h3 className="book-card__title">{titulo || "Sin título"}</h3>
                    <p className="book-card__author">{author || "Autor desconocido"}</p>
                    <span className={`book-card__state book-card__state--${state?.toLowerCase()}`}>
                        {state || "Sin estado"}
                    </span>
                    <div className="book-card__actions">
                        <button onClick={() => setEditing(true)} className="btn btn--small">Editar</button>
                        <button onClick={handleDelete} className="btn btn--small btn--danger">Eliminar</button>
                    </div>
                </div>
            </article>
        )
    }

    return (
        <article className="book-card book-card--editing">
            <div className="book-card__spine"></div>
            <div className="book-card__body">
                <input ref={inputTituloRef} defaultValue={titulo} placeholder="Título" />
                <input ref={inputAuthorRef} defaultValue={author} placeholder="Autor" />
                <select ref={inputStateRef} defaultValue={state}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Leyendo">Leyendo</option>
                    <option value="Leido">Leido</option>
                </select>
                <div className="book-card__actions">
                    <button onClick={handleSave} className="btn btn--small btn--primary">Guardar</button>
                    <button onClick={() => setEditing(false)} className="btn btn--small">Cancelar</button>
                    <button onClick={handleDelete} className="btn btn--small btn--danger">Eliminar</button>
                </div>
            </div>
        </article>
    )
}

export default BookCard
