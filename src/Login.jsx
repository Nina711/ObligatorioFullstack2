import { useRef } from 'react'
import { useNavigate } from 'react-router'

const Login = () => {
    const userNameRef = useRef()
    const passwordRef = useRef()
    const navigate    = useNavigate()

    const handleOnClickLogin = () => {
        const credentials = {
            nombreUsuario: userNameRef.current.value,
            contrasena:    passwordRef.current.value,
        }

        fetch('https://notas-app-backend.vercel.app/v1/auth/login', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(credentials),
        })
            .then(res => {
                if (!res.ok) throw new Error('Credenciales incorrectas')
                return res.json()
            })
            .then(data => {
                localStorage.setItem('token', data.token)
                navigate('/dashboard')
            })
            .catch(err => alert(err.message))
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
                    <button onClick={handleOnClickLogin} className="btn btn--primary">
                        Ingresar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
