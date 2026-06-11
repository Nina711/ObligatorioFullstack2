import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { API_URL } from '../../config/config'
import { setPlan } from '../../features/userSlice'
import '../../styles/ChangePlan.css'

const ChangePlan = () => {
    const dispatch = useDispatch()

    const plan = useSelector(
        state => state.user.plan
    )

    const nombreUsu = useSelector(
        state => state.user.nombreUsu
    )

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleUpgrade = async () => {
        setError('')
        setLoading(true)

        try {
            const res = await fetch(
                `${API_URL}/v1/usuario/premium`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization:
                            localStorage.getItem('token')
                    }
                }
            )

            const data = await res.json()

            if (!res.ok) {
                throw new Error(
                    data.message || 'Error al cambiar de plan'
                )
            }

            dispatch(setPlan('Premium'))

        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="card">
            <p>
                Bienvenido/a {nombreUsu}! Eres un usuario <strong>{plan}</strong>
            </p>

            {plan === 'Plus' ? (
                <>
                    <p>
                        Puedes registrar hasta 4 libros en tu biblioteca.
                    </p>

                    <button
                        className="btn btn--primary"
                        onClick={handleUpgrade}
                        disabled={loading}
                    >
                        {loading
                            ? 'Actualizando...'
                            : 'Pasar a Premium'}
                    </button>
                </>
            ) : (
                <p className="changePlan__success">
                    No tienes límite para agregar libros.
                </p>
            )}

            {error && (
                <p className="changePlan__error">
                    {error}
                </p>
            )}
        </section>
    )
}

export default ChangePlan