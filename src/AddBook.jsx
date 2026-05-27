import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addBook } from './features/notasSlice'

const AddBook = () => {
    const dispatch = useDispatch()

    const titleRef = useRef()
    const authorRef = useRef()
    const descriptionRef = useRef()
    const stateRef = useRef()

    const handleOnClickAddBook = () => {
        const newBook = {
            title: titleRef.current.value,
            author: authorRef.current.value,
            description: descriptionRef.current.value,
            state: stateRef.current.value
        }
        dispatch(addBook(newBook))
    }

    return (
        <section className="create" >
            <h2>Agrega un libro a tu lista!!!</h2>
            <div className="create__form">
                <input ref={titleRef} type="text" placeholder="Nombre del libro" />
                <textarea ref={authorRef} placeholder="Autor del libro"></textarea>

                <input ref={descriptionRef} type="text" placeholder="Descripción del libro" />
                <textarea ref={descriptionRef} placeholder="Descripción del libro"></textarea>

                <select ref={stateRef}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Leyendo">Leyendo</option>
                    <option value="Leido">Leido</option>
                </select>

                <div className="create__actions">
                    <button onClick={handleOnClickAddBook} className="btn btn--primary">Agregar</button>
                </div>

            </div>
        </section >
    )
}

export default AddBook