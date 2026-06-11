import { useNavigate } from 'react-router'
import { API_URL } from '../config/config'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { setUser } from '../features/userSlice'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import '../styles/SignUp.css'

const SignUp = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid }
    } = useForm({
        mode: 'onChange'
    })

    const onSubmit = async (data) => {

        const newUser = {
            nombre: data.name,
            apellido: data.lastName,
            nombreUsuario: data.userName,
            mail: data.mail,
            contrasena: data.password
        }

        try {
            const res = await fetch(`${API_URL}/v1/registrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })

            if (!res.ok) {
                const e = await res.json()
                throw new Error(
                    e.message || 'Error al registrarse'
                )
            }

            const data = await res.json()

            toast.success('Cuenta creada correctamente', {
                position: 'bottom-right'
            })

            localStorage.setItem('token', data.token)

            const payload = jwtDecode(data.token)

            dispatch(
                setUser({
                    id: payload.idUsu,
                    rol: payload.rolUsu,
                    plan: payload.planUsu,
                    nombreUsu: payload.nombreUsu
                })
            )

            setTimeout(() => {
                navigate('/dashboard')
            }, 1500)

        } catch (e) {
            toast.error(e.message, {
                position: 'bottom-right'
            })
        }
    }

    return (
        <div className="login-page">
            <div className="login-card login-card--wide">
                <div className="login-card__header">
                    <div className="signUp-logo">
                        <img src="/logo.svg" alt="Logo" />
                    </div>
                    <h1>Crear Cuenta</h1>
                    <p className="login-card__subtitle"><i>Organiza tus lecturas y construye tu biblioteca ideal.</i></p>
                    <div className="login-card__ornament">────────────</div>
                </div>

                <form
                    className="login-card__form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="login-card__row">
                        <div>
                            <label>Nombre</label>
                            <input type="text" placeholder="Tu nombre"
                                {...register('name', {
                                    required: 'Debe ingresar un nombre'
                                })}
                            />

                            {errors.name && (
                                <p className="login-card__error">{errors.name.message}</p>
                            )}
                        </div>
                        <div>
                            <label>Apellido</label>
                            <input type="text" placeholder="Tu apellido"
                                {...register('lastName', {
                                    required: 'Debe ingresar un apellido'
                                })}
                            />

                            {errors.lastName && (
                                <p className="login-card__error">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label>Nombre de usuario</label>
                        <input type="text" placeholder="Nombre de usuario único"
                            {...register('userName', {
                                required: 'Debe ingresar un nombre de usuario',
                                minLength: {
                                    value: 3,
                                    message: 'Debe tener al menos 3 caracteres'
                                },
                                maxLength: {
                                    value: 15,
                                    message: 'El nombre de usuario no puede superar los 15 caracteres'
                                }
                            })}
                        />

                        {errors.userName && (
                            <p className="login-card__error">{errors.userName.message}</p>
                        )}
                    </div>

                    <div>
                        <label>Correo electrónico</label>
                        <input type="email" placeholder="correo@ejemplo.com"
                            {...register('mail', {
                                required: 'Debe ingresar un email',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Debe ingresar un email válido'
                                }
                            })}
                        />

                        {errors.mail && (
                            <p className="login-card__error">
                                {errors.mail.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label>Contraseña</label>
                        <input type="password" placeholder="Contraseña"
                            {...register('password', {
                                required: 'Debe ingresar una contraseña',
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
                            <p className="login-card__error">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label>Repetir contraseña</label>
                        <input
                            type="password"
                            placeholder="Repetir contraseña"
                            {...register('confirmPassword', {
                                required: 'Debe repetir la contraseña',
                                validate: value =>
                                    value === watch('password') ||
                                    'Las contraseñas no coinciden'
                            })}
                        />

                        {errors.confirmPassword && (
                            <p className="login-card__error">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button type="submit" className="btn btn--primary" disabled={!isValid}>
                        Crear cuenta
                    </button>
                    <button type="button" className="btn" onClick={() => navigate('/login')}>
                        Ya tengo cuenta — Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SignUp
