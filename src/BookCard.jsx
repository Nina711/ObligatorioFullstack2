import { useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { deleteBook, updateBook } from "./features/bookSlice"

const BookCard = ({ id, titulo, texto, prioridad }) => {
    const dispatch = useDispatch()

    const [editing, setEditing] = useState(false)
    const inputTituloRef = useRef()
    const inputtextoRef = useRef()


    const handleonClickUpdate = () => {
        setEditing(true)
    }

    const handleOnClickGuardarEdicion = () => {
        const titulo = inputTituloRef.current.value
        const texto = inputtextoRef.current.value

        if (!titulo || !texto) {
            alert("Titulo y texto obligatorios")
            return
        }

        dispatch(updateBook({
            id,
            modificado: { titulo, texto }
        }))

        console.log(inputTituloRef.current.value)
        console.log(inputtextoRef.current.value)
        setEditing(false)
    }

    const handleOnClickEliminar = () => {
        fetch(`https://notas-app-backend.vercel.app/v1/notas/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: localStorage.getItem('token'),
            }
        }).then(res => {
            if (res.ok) {
                dispatch(deleteBook(id))
            } else {
                alert("no se pudo borrar")
            }
        })
    }



    if (!editing) {
        return (
            <article className="note">
                <div className="note__header">
                    <h3 className="note__title">{titulo || "Nota sin título"}</h3>
                    <span className="note__priority">{prioridad ? 'Prioridad:' + prioridad : 'Sin prioridad'}</span>
                </div>

                <p className="note__content">
                    {texto ? texto : 'Sin discripción'}
                </p>

                <div className="note__actions">
                    <button onClick={handleonClickUpdate} className="btn btn--small">Editar</button>
                    <button onClick={handleOnClickEliminar} className="btn btn--small btn--danger">Eliminar</button>
                    <button className="btn btn--small btn--fav">⭐ Favorita</button>
                </div>

            </article>
        )
    } else {
        return (
            <article className="note note--editing">
                <div className="note__header">
                    <input className="note__input" ref={inputTituloRef} defaultValue={titulo} />
                    <select defaultValue={prioridad} className="note__select">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                    </select>
                </div>
                <textarea ref={inputtextoRef} className="note__textarea">
                    {texto}
                </textarea>
                <div className="note__actions">
                    <button onClick={handleOnClickGuardarEdicion} className="btn btn--small btn--primary">Guardar</button>
                    <button onClick={handleOnClickEliminar} className="btn btn--small btn--danger">Eliminar</button>
                    <button className="btn btn--small btn--fav">⭐ Favorita</button>
                </div>
            </article>
        )
    }


}

export default BookCard