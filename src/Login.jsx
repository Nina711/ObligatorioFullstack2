import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { API_URL } from './config'

const Login = () => {
    const userNameRef = useRef()
    const passwordRef = useRef()
    const navigate    = useNavigate()
    const [error, setError] = useState('')

    const handleOnClickLogin = () => {
        setError('')
        const credentials = {
            nombreUsuario: userNameRef.current.value,
            contrasena:    passwordRef.current.value,
        }

        fetch(`${API_URL}/v1/login`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(credentials),
        })
            .then(res => {
                if (!res.ok) throw new Error('Credenciales incorrectas')
                return res.json()
            })
            .then(data => {
                const token = data.token || data
                localStorage.setItem('token', token)
                navigate('/dashboard')
            })
            .catch(err => setError(err.message))
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-card__header">
                    <div className="login-card__ornament">✦ ✦ ✦</div>
                    <h1>Mi Biblioteca</h1>
                    <p className="login-card__subtitle">Accede a tu colección personal</p>
                    <div className="login-card__ornament">✦ ✦ ✦</div>
                </div>

                <div className="login-card__form">
                    <div>
                        <label>Usuario</label>
                        <input ref={userNameRef} type="text" placeholder="Nombre de usuario" />
                    </div>
                    <div>
                        <label>Contraseña</label>
                        <input ref={passwordRef} type="password" placeholder="Contraseña" />
                    </div>
                    {error && <p className="login-card__error">{error}</p>}
                    <button onClick={handleOnClickLogin} className="btn btn--primary">
                        Ingresar
                    </button>
                    <button className="btn" onClick={() => navigate('/signup')}>
                        No tengo cuenta — Registrarme
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
