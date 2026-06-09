import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { API_URL } from './config'
import { useDispatch } from 'react-redux'
import { setUser } from './features/userSlice'
import { jwtDecode } from 'jwt-decode'
import logo from '../public/logo.svg'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm({
        mode: 'onChange'
    })

    const onSubmit = (data) => {

        setError('')

        const credentials = {
            nombreUsuario: data.userName,
            contrasena: data.password
        }

        setLoading(true)

        fetch(`${API_URL}/v1/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        }).then(res => {
            if (!res.ok) {
                throw new Error('Credenciales incorrectas')
            }
            return res.json()
        }).then(data => {
            const token = data.token || data
            localStorage.setItem('token', token)

            const payload = jwtDecode(token)

            dispatch(
                setUser({
                    id: payload.idUsu,
                    rol: payload.rolUsu,
                    plan: payload.planUsu
                })
            )

            navigate('/dashboard')
        }).catch(e => setError(e.message))
            .finally(() => setLoading(false))

    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-card__header">
                    <div className="login-logo">
                        <img src={logo} alt="StoryShelf" />
                    </div>
                    <h1>StoryShelf</h1>
                    <p className="login-card__subtitle">
                        <i>Cada historia tiene su lugar.</i>
                    </p>
                    <div className="login-card__ornament">────────────</div>
                </div>

                <form
                    className="login-card__form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <label>Usuario</label>

                        <input
                            type="text"
                            placeholder="Nombre de usuario"
                            {...register('userName', {
                                required: 'El usuario es obligatorio',
                                minLength: {
                                    value: 3,
                                    message: 'El nombre de usuario debe tener al menos 3 caracteres'
                                },
                                maxLength: {
                                    value: 15,
                                    message: 'El nombre de usuario no puede superar los 15 caracteres'
                                }
                            })}
                        />

                        {errors.username && (
                            <p className="login-card__error">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label>Contraseña</label>

                        <input
                            type="password"
                            placeholder="Contraseña"
                            {...register('password', {
                                required: 'La contraseña es obligatoria',
                                minLength: {
                                    value: 8,
                                    message: 'La contraseña debe tener al menos 8 caracteres'
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'La contraseña no puede superar los 20 caracteres'
                                }
                            })}
                        />

                        {errors.password && (
                            <p className="login-card__error">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {error && (
                        <p className="login-card__error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn btn--primary"
                        disabled={!isValid || loading}
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>

                    <button
                        type="button"
                        className="btn"
                        onClick={() => navigate('/signup')}
                    >
                        No tengo cuenta — Registrarme
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
