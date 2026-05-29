import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addBook } from './features/bookSlice'

const AddBook = () => {
    const dispatch      = useDispatch()
    const titleRef      = useRef()
    const authorRef     = useRef()
    const descriptionRef = useRef()
    const stateRef      = useRef()

    const handleOnClickAddBook = () => {
        const newBook = {
            titulo:      titleRef.current.value,
            author:      authorRef.current.value,
            description: descriptionRef.current.value,
            state:       stateRef.current.value,
        }
        dispatch(addBook(newBook))
    }

    return (
        <section className="add-book">
            <h2 className="add-book__title">Registrar Nuevo Libro</h2>
            <div className="divider">— ✦ —</div>

            <div className="add-book__form">
                <div className="form-field">
                    <label>Título</label>
                    <input ref={titleRef} type="text" placeholder="Título del libro" />
                </div>

                <div className="form-field">
                    <label>Autor</label>
                    <input ref={authorRef} type="text" placeholder="Autor del libro" />
                </div>

                <div className="form-field form-field--full">
                    <label>Descripción</label>
                    <textarea ref={descriptionRef} placeholder="Breve descripción del libro" rows="3"></textarea>
                </div>

                <div className="form-field">
                    <label>Estado de lectura</label>
                    <select ref={stateRef}>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Leyendo">Leyendo</option>
                        <option value="Leido">Leído</option>
                    </select>
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
