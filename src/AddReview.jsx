import { useState } from "react";
import { API_URL } from "./config"
import { toast } from 'react-toastify'


const AddReview = ({ bookId, onReviewCreated, onCancel }) => {
    const [calificacion, setCalificacion] = useState(5)
    const [comentario, setComentario] = useState('')
    const [loading, setLoading] = useState(false)
    const [imagen, setImagen] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const res = await fetch(
                `${API_URL}/v1/reviews/${bookId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                },
                body: JSON.stringify({ calificacion, comentario })
            })

            if (!res.ok) {
                const error = await res.json()

                throw new Error(
                    error.message ||
                    error.error ||
                    'No se pudo crear la reseña'
                )
            }

            const review = await res.json()

            if (imagen) {

                const formData = new FormData()

                formData.append('img', imagen)

                const imageRes = await fetch(
                    `${API_URL}/v1/reviews/${review.id}/imagen`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization:
                                localStorage.getItem('token')
                        },
                        body: formData
                    }
                )

                if (!imageRes.ok) {

                    throw new Error(
                        'La reseña fue creada pero no se pudo subir la imagen'
                    )

                }

                const reviewConImagen =
                    await imageRes.json()

                onReviewCreated(reviewConImagen)
                console.log(reviewConImagen)

            } else {

                onReviewCreated(review)

            }
        } catch (e) {
            toast.error(e.message, {
                position: "bottom-right"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            className="review-form"
            onSubmit={handleSubmit}
        >
            <label>Calificación</label>

            <select
                value={calificacion}
                onChange={(e) =>
                    setCalificacion(Number(e.target.value))
                }
            >
                <option value={1}>1 ⭐</option>
                <option value={2}>2 ⭐⭐</option>
                <option value={3}>3 ⭐⭐⭐</option>
                <option value={4}>4 ⭐⭐⭐⭐</option>
                <option value={5}>5 ⭐⭐⭐⭐⭐</option>
            </select>

            <label>Comentario</label>

            <textarea
                rows="3"
                value={comentario}
                onChange={(e) =>
                    setComentario(e.target.value)
                }
            />

            <label>Imagen (opcional)</label>

            <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                    setImagen(e.target.files[0])
                }
            />

            <div className="review-form__actions">

                <button
                    type="button"
                    onClick={onCancel}
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={loading}
                >
                    Guardar reseña
                </button>
            </div>
        </form>
    )
}

export default AddReview
