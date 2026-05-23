import { useRef } from 'react'

const Login = ({ onLogin }) => {

    const userName = useRef()
    const password = useRef()

    const handleOnClickLogin = () => {
        const loggedUser = {
            nombreUsuario: userName.current.value,
            contrasena: password.current.value,
        }
        onLogin(loggedUser)
    }

    return (
        <div>
            <h2>Iniciar sesión</h2>
            <input ref={userName} type="text" placeholder="Usuario" />
            <input ref={password} type="password" placeholder="Contraseña" />
            <button onClick={handleOnClickLogin}>Ingresar</button>
        </div>
    )
}

export default Login