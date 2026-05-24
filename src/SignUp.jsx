import { useRef } from 'react'

const SignUp = ({ onSignUp }) => {

    const name = useRef()
    const lastName = useRef()
    const userName = useRef()
    const email = useRef()
    const password = useRef()

    const handleOnClickSignUp = () => {
        const newUser = {
            name: name.current.value,
            lastName: lastName.current.value,
            userName: userName.current.value,
            email: email.current.value,
            password: password.current.value,
        }
        onSignUp(newUser)
    }

    return (
        <div>
            <h2>Registrarse</h2>
            <input ref={name} type="text" placeholder="Nombre" />
            <input ref={lastName} type="text" placeholder="Apellido" />
            <input ref={userName} type="text" placeholder="Nombre de usuario" />
            <input ref={email} type="email" placeholder="Email" />
            <input ref={password} type="password" placeholder="Contraseña" />
            <button onClick={handleOnClickSignUp}>Crear cuenta</button>
        </div>
    )
}

export default SignUp
