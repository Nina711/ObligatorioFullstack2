import { useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { deleteBook, updateBook } from "./features/bookSlice"
import { API_URL } from "./config"

const BookCard = ({ id, titulo, autor, genero, estado }) => {
    const dispatch = useDispatch()
    const [editing, setEditing] = useState(false)

    const inputTituloRef = useRef()
    const inputAutorRef  = useRef()
    const inputEstadoRef = useRef()

    const handleSave = () => {
        const newTitulo = inputTituloRef.current.value
        const newAutor  = inputAutorRef.current.value

        if (!newTitulo || !newAutor) {
            alert("Título y autor son obligatorios")
            return
        }

        dispatch(updateBook({
            id,
            modificado: {
                titulo: newTitulo,
                autor:  newAutor,
                estado: inputEstadoRef.current.value,
            }
        }))
        setEditing(false)
    }

    const handleDelete = async () => {
        try {
            const res = await fetch(`${API_URL}/v1/libros/${id}`, {
                method:  "DELETE",
                headers: { Authorization: localStorage.getItem('token') },
            })
            if (res.ok) dispatch(deleteBook(id))
            else alert("No se pudo eliminar el libro")
        } catch {
            alert("Error de conexión")
        }
    }

    if (!editing) {
        return (
            <article className="book-card">
                <div className="book-card__spine"></div>
                <div className="book-card__body">
                    <h3 className="book-card__title">{titulo || "Sin título"}</h3>
                    <p className="book-card__author">{autor || "Autor desconocido"}</p>
                    {genero && <p className="book-card__genre">{genero}</p>}
                    <span className={`book-card__state book-card__state--${estado?.toLowerCase()}`}>
                        {estado || "Sin estado"}
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
                <input ref={inputAutorRef}  defaultValue={autor}  placeholder="Autor" />
                <select ref={inputEstadoRef} defaultValue={estado}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Leyendo">Leyendo</option>
                    <option value="Leido">Leído</option>
                </select>
                <div className="book-card__actions">
                    <button onClick={handleSave}           className="btn btn--small btn--primary">Guardar</button>
                    <button onClick={() => setEditing(false)} className="btn btn--small">Cancelar</button>
                    <button onClick={handleDelete}         className="btn btn--small btn--danger">Eliminar</button>
                </div>
            </div>
        </article>
    )
}

export default BookCard
