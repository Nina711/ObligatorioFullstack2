import { useState } from "react"
import { useDispatch } from "react-redux"
import { deleteBook, updateBook } from "./features/bookSlice"
import { API_URL } from "./config"
import { useForm } from "react-hook-form"

const BookCard = ({ id, titulo, autor, genero, descripcion, estado }) => {

    const dispatch = useDispatch()
    const [editing, setEditing] = useState(false)
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            titulo,
            autor,
            genero,
            descripcion,
            estado
        }
    })

    const handleSave = async (data) => {
        console.log("ID recibido por props:", id);
        setError('')
        const libroModificado = {
            titulo: data.titulo,
            autor: data.autor,
            genero: data.genero,
            descripcion: data.descripcion,
            estado: data.estado
        }

        console.log(data);
        console.log(data._id);
        console.log(data.id);

        try {
            const res = await fetch(
                `${API_URL}/v1/libros/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    },
                    body: JSON.stringify(libroModificado)
                }
            )

            if (!res.ok) {
                const error = await res.json()
                throw new Error(
                    error.message ||
                    error.error ||
                    'No se pudo actualizar el libro'
                )
            }

            dispatch(
                updateBook({
                    id,
                    modificado: libroModificado
                })
            )

            setEditing(false)

        } catch (e) {
            setError(e.message)
        }
    }

    const descripcionCorta =
        descripcion?.length > 100
            ? `${descripcion.slice(0, 100)}...`
            : descripcion

    const handleDelete = async () => {
        console.log("ID recibido por props:", id);
        try {
            const res = await fetch(`${API_URL}/v1/libros/${id}`, {
                method: "DELETE",
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
                    {descripcionCorta && (
                        <p className="book-card__description">
                            {descripcionCorta}
                        </p>
                    )}
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

            <form
                className="book-card__body"
                onSubmit={handleSubmit(handleSave)}
            >
                <input
                    placeholder="Título"
                    {...register('titulo', {
                        required: 'Debe ingresar un título'
                    })}
                />

                {errors.titulo && (
                    <p className="login-card__error">
                        {errors.titulo.message}
                    </p>
                )}

                <input
                    placeholder="Autor"
                    {...register('autor', {
                        minLength: {
                            value: 2,
                            message: 'Debe tener al menos 2 caracteres'
                        },
                        maxLength: {
                            value: 70,
                            message: 'Este campo puede tener máximo 70 caracteres'
                        }
                    })}
                />

                {errors.autor && (
                    <p className="login-card__error">
                        {errors.autor.message}
                    </p>
                )}

                <input
                    placeholder="Género"
                    {...register('genero', {
                        maxLength: {
                            value: 30,
                            message: 'Este campo puede tener máximo 30 caracteres'
                        }
                    })}
                />

                {errors.genero && (
                    <p className="login-card__error">
                        {errors.genero.message}
                    </p>
                )}

                <textarea
                    rows="4"
                    placeholder="Descripción"
                    {...register('descripcion', {
                        minLength: {
                            value: 30,
                            message: 'La descripción debe tener al menos 30 caracteres'
                        },
                        maxLength: {
                            value: 1000,
                            message: 'Este campo puede tener máximo 1000 caracteres'
                        }
                    })}
                />

                {errors.descripcion && (
                    <p className="login-card__error">
                        {errors.descripcion.message}
                    </p>
                )}

                <select {...register('estado')}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Leyendo">Leyendo</option>
                    <option value="Leido">Leído</option>
                </select>

                {error && (
                    <p className="login-card__error">
                        {error}
                    </p>
                )}

                <div className="book-card__actions">
                    <button
                        type="submit"
                        className="btn btn--small btn--primary"
                    >
                        Guardar
                    </button>

                    <button
                        type="button"
                        className="btn btn--small"
                        onClick={() => setEditing(false)}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="btn btn--small btn--danger"
                        onClick={handleDelete}
                    >
                        Eliminar
                    </button>
                </div>
            </form>
        </article>
    )
}

export default BookCard
