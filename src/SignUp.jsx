import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { API_URL } from './config'

const SignUp = () => {
    const nombreRef        = useRef()
    const apellidoRef      = useRef()
    const nombreUsuarioRef = useRef()
    const mailRef          = useRef()
    const contrasenaRef    = useRef()
    const navigate         = useNavigate()
    const [error, setError]     = useState('')
    const [success, setSuccess] = useState('')

    const handleOnClickSignUp = async () => {
        setError('')
        setSuccess('')
        const newUser = {
            nombre:        nombreRef.current.value,
            apellido:      apellidoRef.current.value,
            nombreUsuario: nombreUsuarioRef.current.value,
            mail:          mailRef.current.value,
            contrasena:    contrasenaRef.current.value,
        }

        try {
            const res = await fetch(`${API_URL}/v1/registrar`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(newUser),
            })
            if (!res.ok) {
                const d = await res.json()
                throw new Error(d.message || 'Error al registrarse')
            }
            setSuccess('Cuenta creada. Redirigiendo...')
            setTimeout(() => navigate('/login'), 1500)
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="login-page">
            <div className="login-card login-card--wide">
                <div className="login-card__header">
                    <div className="login-card__ornament">✦ ✦ ✦</div>
                    <h1>Crear Cuenta</h1>
                    <p className="login-card__subtitle">Únete a tu biblioteca personal</p>
                    <div className="login-card__ornament">✦ ✦ ✦</div>
                </div>

                <div className="login-card__form">
                    <div className="login-card__row">
                        <div>
                            <label>Nombre</label>
                            <input ref={nombreRef} type="text" placeholder="Tu nombre" />
                        </div>
                        <div>
                            <label>Apellido</label>
                            <input ref={apellidoRef} type="text" placeholder="Tu apellido" />
                        </div>
                    </div>

                    <div>
                        <label>Nombre de usuario</label>
                        <input ref={nombreUsuarioRef} type="text" placeholder="Nombre de usuario único" />
                    </div>

                    <div>
                        <label>Correo electrónico</label>
                        <input ref={mailRef} type="email" placeholder="correo@ejemplo.com" />
                    </div>

                    <div>
                        <label>Contraseña</label>
                        <input ref={contrasenaRef} type="password" placeholder="Contraseña" />
                    </div>

                    {error   && <p className="login-card__error">{error}</p>}
                    {success && <p className="login-card__success">{success}</p>}

                    <button onClick={handleOnClickSignUp} className="btn btn--primary">
                        Crear cuenta
                    </button>
                    <button className="btn" onClick={() => navigate('/login')}>
                        Ya tengo cuenta — Iniciar sesión
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SignUp
