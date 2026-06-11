import React from 'react'
import '../../styles/BookFilters.css'

const BookFilters = ({ filters, setFilters }) => {
    return (
        <section className="book-filters-section">

            <h2 className="books-section__title">Filtra tu estantería</h2>

            <div className="book-filters">

                <div className="form-field">
                    <label>Titulo</label>
                    <input
                        value={filters.titulo}
                        onChange={(e) => setFilters({
                            ...filters,
                            titulo: e.target.value
                        })
                        }
                    />
                </div>

                <div className="form-field">
                    <label>Autor</label>
                    <input
                        value={filters.autor}
                        onChange={(e) => setFilters({
                            ...filters,
                            autor: e.target.value
                        })
                        }
                    />
                </div>

                <div className="form-field">
                    <label>Género</label>
                    <input
                        value={filters.genero}
                        onChange={(e) => setFilters({
                            ...filters,
                            genero: e.target.value
                        })
                        }
                    />
                </div>

                <div className="form-field">
                    <label>Estado de lectura</label>
                    <select
                        value={filters.estado}
                        onChange={(e) => setFilters({
                            ...filters,
                            estado: e.target.value
                        })
                        }
                    >
                        <option value="">Todos</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Leyendo">Leyendo</option>
                        <option value="Leido">Leído</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Calificación</label>
                    <select
                        value={filters.rating}
                        onChange={(e) => setFilters({
                            ...filters,
                            rating: e.target.value
                        })
                        }
                    >
                        <option value=""></option>
                        <option value="1">1 ⭐</option>
                        <option value="2">2 ⭐⭐</option>
                        <option value="3">3 ⭐⭐⭐</option>
                        <option value="4">4 ⭐⭐⭐⭐</option>
                        <option value="5">5 ⭐⭐⭐⭐⭐</option>
                    </select>
                </div>

                <div className="book-filters__actions">
                    <button
                        className='btn btn--primary'
                        type='button'
                        onClick={() => setFilters({
                            titulo: '',
                            autor: '',
                            genero: '',
                            estado: '',
                            rating: ''
                        })}
                    >Limpiar</button>
                </div>
            </div>
        </section>
    )
}

export default BookFilters