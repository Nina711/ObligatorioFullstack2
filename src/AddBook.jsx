import { useDispatch } from 'react-redux'
import { addBook } from './features/bookSlice'
import { API_URL } from './config'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'

const AddBook = () => {
    const dispatch = useDispatch()
    const [opciones, setOpciones] = useState([])
    const [seleccionado, setSeleccionado] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isValid }
    } = useForm({
        mode: 'onChange'
    })

    const titulo = watch('titulo')

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const res = await fetch(
                `${API_URL}/v1/libros`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    },
                    body: JSON.stringify(data)
                }
            )

            if (!res.ok) {
                const error = await res.json()

                throw new Error(
                    error.message ||
                    error.error ||
                    'No se pudo agregar el libro'
                )
            }

            const book = await res.json()
            console.log("RESPUESTA BACKEND:", book)

            dispatch(addBook(book))

            reset()

        } catch (e) {
            alert(e.message)
        }
    }

    useEffect(() => {

        if (seleccionado) {
            setSeleccionado(false)
            return
        }

        if (!titulo || titulo.length < 3) {
            setOpciones([])
            return
        }

        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    `${API_URL}/v1/libros/buscar?titulo=${encodeURIComponent(titulo)}`,
                    {
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    }
                )

                if (!res.ok) {
                    throw new Error()
                }

                const data = await res.json()

                setOpciones(data)

            } catch {
                setOpciones([])
            }

        }, 500)

        return () => clearTimeout(timeout)

    }, [titulo])

    const seleccionarLibro = (libro) => {

        setSeleccionado(true)

        setValue('titulo', libro.titulo)

        setValue('autor', libro.autor || '')

        setValue('genero', libro.genero || '')

        setValue('descripcion', libro.descripcion || '')

        setOpciones([])
    }

    return (
        <section className="add-book">
            <h2 className="add-book__title">Registrar Nuevo Libro</h2>
            <div className="divider">— ✦ —</div>

            <form
                className="add-book__form"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="form-field">
                    <label>Título</label>
                    <input
                        type="text"
                        placeholder="Título del libro"
                        {...register('titulo', {
                            required: 'Debe ingresar un título'
                        })}
                    />

                    {opciones.length > 0 && (
                        <div className="book-suggestions">

                            {opciones.map((libro, index) => (

                                <div
                                    key={index}
                                    onClick={() => seleccionarLibro(libro)}
                                >
                                    <strong>{libro.titulo}</strong>
                                    
                                    {libro.autor && (
                                        <p>{libro.autor}</p>
                                    )}
                                </div>

                            ))}

                        </div>
                    )}

                    {errors.titulo && (
                        <p className="login-card__error">
                            {errors.titulo.message}
                        </p>
                    )}
                </div>

                <div className="form-field">
                    <label>Autor</label>
                    <input
                        type="text"
                        placeholder="Autor del libro"
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
                </div>

                <div className="form-field">
                    <label>Género</label>
                    <input
                        type="text"
                        placeholder="Ej: Novela, Ciencia ficción..."
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
                </div>

                <div className="form-field">
                    <label>Estado de lectura</label>
                    <select {...register('estado')}>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Leyendo">Leyendo</option>
                        <option value="Leido">Leído</option>
                    </select>
                </div>

                <div className="form-field form-field--full">
                    <label>Descripción</label>
                    <textarea
                        rows="3"
                        placeholder="Breve descripción del libro"
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
                </div>

                <div className="add-book__actions">
                    <button
                        type="submit"
                        className="btn btn--primary"
                        disabled={!isValid}
                    >Crear</button>
                </div>
            </form>
        </section>
    )
}

export default AddBook
