import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addBook } from './features/bookSlice'
import { API_URL } from './config'

const AddBook = () => {
    const dispatch       = useDispatch()
    const tituloRef      = useRef()
    const autorRef       = useRef()
    const generoRef      = useRef()
    const descripcionRef = useRef()
    const estadoRef      = useRef()

    const handleOnClickAddBook = async () => {
        const newBook = {
            titulo:      tituloRef.current.value,
            autor:       autorRef.current.value,
            genero:      generoRef.current.value,
            descripcion: descripcionRef.current.value,
            estado:      estadoRef.current.value,
        }

        try {
            const res = await fetch(`${API_URL}/v1/libros`, {
                method:  'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  localStorage.getItem('token'),
                },
                body: JSON.stringify(newBook),
            })
            if (!res.ok) throw new Error('No se pudo agregar el libro')
            const data = await res.json()
            dispatch(addBook(data))
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <section className="add-book">
            <h2 className="add-book__title">Registrar Nuevo Libro</h2>
            <div className="divider">— ✦ —</div>

            <div className="add-book__form">
                <div className="form-field">
                    <label>Título</label>
                    <input ref={tituloRef} type="text" placeholder="Título del libro" />
                </div>

                <div className="form-field">
                    <label>Autor</label>
                    <input ref={autorRef} type="text" placeholder="Autor del libro" />
                </div>

                <div className="form-field">
                    <label>Género</label>
                    <input ref={generoRef} type="text" placeholder="Ej: Novela, Ciencia ficción..." />
                </div>

                <div className="form-field">
                    <label>Estado de lectura</label>
                    <select ref={estadoRef}>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Leyendo">Leyendo</option>
                        <option value="Leido">Leído</option>
                    </select>
                </div>

                <div className="form-field form-field--full">
                    <label>Descripción</label>
                    <textarea ref={descripcionRef} placeholder="Breve descripción del libro" rows="3"></textarea>
                </div>

                <div className="add-book__actions">
                    <button onClick={handleOnClickAddBook} className="btn btn--primary">
                        Agregar a la colección
                    </button>
                </div>
            </div>
        </section>
    )
}

export default AddBook
