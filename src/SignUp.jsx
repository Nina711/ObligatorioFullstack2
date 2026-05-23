import { useRef } from 'react'

const SignUp = ({ onSignUp }) => {

    const nombre = useRef()
    const apellido = useRef()
    const nombreUsuario = useRef()
    const mail = useRef()
    const contrasena = useRef()

    const handleOnClickSignUp = () => {
        const newUser = {
            nombre: nombre.current.value,
            apellido: apellido.current.value,
            nombreUsuario: nombreUsuario.current.value,
            mail: mail.current.value,
            contrasena: contrasena.current.value,
        }
        onSignUp(newUser)
    }

    return (
        <div>
            <h2>Registrarse</h2>
            <input ref={nombre} type="text" placeholder="Nombre" />
            <input ref={apellido} type="text" placeholder="Apellido" />
            <input ref={nombreUsuario} type="text" placeholder="Nombre de usuario" />
            <input ref={mail} type="email" placeholder="Email" />
            <input ref={contrasena} type="password" placeholder="Contraseña" />
            <button onClick={handleOnClickSignUp}>Crear cuenta</button>
        </div>
    )
}

export default SignUp
