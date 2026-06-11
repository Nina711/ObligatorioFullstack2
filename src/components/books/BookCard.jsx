import { useState } from "react"
import { useDispatch } from "react-redux"
import { deleteBook, updateBook } from "../../features/bookSlice"
import { API_URL } from "../../config/config"
import { useForm } from "react-hook-form"
import { addReview, deleteReview } from "../../features/reviewSlice"
import AddReview from "../books/AddReview"
import ReactModal from "react-modal"
import { toast } from 'react-toastify'


const BookCard = ({ id, titulo, autor, genero, descripcion, estado, review }) => {

    const dispatch = useDispatch()
    const [editing, setEditing] = useState(false)
    const [error, setError] = useState('')
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [deleteBookModal, setDeleteBookModal] = useState(false)
    const [deleteReviewModal, setDeleteReviewModal] = useState(false)

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        }
    };

    ReactModal.setAppElement('#root');

    const openDeleteBookModal = () => {
        setDeleteBookModal(true)
    }

    const closeDeleteBookModal = () => {
        setDeleteBookModal(false)
    }

    const openDeleteReviewModal = () => {
        setDeleteReviewModal(true)
    }

    const closeDeleteReviewModal = () => {
        setDeleteReviewModal(false)
    }

    const handleDeleteModal = async () => {
        try {
            const res = await fetch(`${API_URL}/v1/libros/${id}`, {
                method: "DELETE",
                headers: { Authorization: localStorage.getItem('token') },
            })
            if (res.ok) {
                dispatch(deleteBook(id))
                closeDeleteBookModal()
            }
            else {
                toast.error('No se pudo eliminar el libro', {
                    position: "bottom-right"
                })
            }
        } catch {
            toast.error('Error de conexión', {
                position: "bottom-right"
            })
        }
    }

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

    const handleReviewDelete = async () => {
        console.log("REVIEW:", review)
    console.log("REVIEW ID:", review?.id)
        try {
            const res = await fetch(`${API_URL}/v1/reviews/${review.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: localStorage.getItem('token')
                },
            })

            if (res.ok) {
                dispatch(deleteReview(review.id))
                closeDeleteReviewModal()
            } else {
                toast.error('No se pudo eliminar la reseña', {
                    position: "bottom-right"
                })
            }
        } catch {
            toast.error('Error de conexión', {
                position: "bottom-right"
            })
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
                        <button onClick={openDeleteBookModal} className="btn btn--small btn--danger">Eliminar</button>
                    </div>

                    {estado === 'Leido' && !review && (
                        <button
                            className="btn btn--small btn--primary"
                            onClick={() => setShowReviewForm(true)}
                        >
                            ⭐ Agregar reseña
                        </button>
                    )}

                    {showReviewForm && (
                        <AddReview
                            bookId={id}
                            onCancel={() => setShowReviewForm(false)}
                            onReviewCreated={(reviewCreada) => {
                                dispatch(addReview(reviewCreada))
                                setShowReviewForm(false)
                            }}
                        />
                    )}
                    <ReactModal
                        isOpen={deleteBookModal}
                        onRequestClose={closeDeleteBookModal}
                        style={customStyles}
                    >
                        <p>{`¿Estás seguro de que deseas eliminar ${titulo}?`}
                        </p>
                        <button onClick={handleDeleteModal}>Si</button>
                    </ReactModal>

                    {review && (
                        <div className="book-review">
                            <p className="book-review__rating">
                                {'⭐'.repeat(review.calificacion)}
                            </p>

                            {review.comentario && (
                                <p>{review.comentario}</p>
                            )}

                            {review.urlImagen && (
                                <div className="book-review__image-wrapper">
                                    <img
                                        src={review.urlImagen}
                                        alt="Imagen de la reseña"
                                        className="book-review__image"
                                    />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={openDeleteReviewModal}
                            >
                                Eliminar reseña
                            </button>

                            <ReactModal
                                isOpen={deleteReviewModal}
                                onRequestClose={closeDeleteReviewModal}
                            >
                                <p>¿Estás seguro de que deseas eliminar esta reseña?</p>
                                <button onClick={handleReviewDelete}>Si</button>

                            </ReactModal>

                        </div>
                    )}
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
                <ReactModal
                    isOpen={deleteBookModal}
                    onRequestClose={closeDeleteBookModal}
                    style={customStyles}
                >
                    <p>`¿Estás seguro de que deseas eliminar "${titulo}"?`
                    </p>
                    <button onClick={handleDeleteModal}>Si</button>
                </ReactModal>

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
                        onClick={openDeleteBookModal}
                    >
                        Eliminar
                    </button>
                </div>
            </form>
        </article>
    )
}

export default BookCard
