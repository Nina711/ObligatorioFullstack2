import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { API_URL } from './config'

const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes'

const Recommendations = () => {
    const books = useSelector(state => state.books.books)
    const lastBook = books[books.length - 1]

    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!lastBook?.id) return

        const fetchRecommendations = async () => {
            setLoading(true)
            setError(null)
            setRecommendations([])
            try {
                const res = await fetch(`${API_URL}/v1/libros/${lastBook.id}/sugerencia-libros`, {
                    headers: { Authorization: localStorage.getItem('token') }
                })
                if (!res.ok) throw new Error('Error al obtener sugerencias')

                const data = await res.json()
                const bookNames = data.sugerencia
                    .split('/')
                    .map(s => s.trim())
                    .filter(Boolean)

                const bookDetails = await Promise.all(
                    bookNames.map(async (name) => {
                        try {
                            const params = new URLSearchParams({
                                q: `intitle:${name}`,
                                maxResults: '1',
                                printType: 'books'
                            })
                            const gbRes = await fetch(`${GOOGLE_BOOKS_URL}?${params}`)
                            if (!gbRes.ok) return { title: name, authors: [], image: null, infoLink: null }
                            const gbData = await gbRes.json()
                            if (!gbData.items?.length) return { title: name, authors: [], image: null, infoLink: null }
                            const vol = gbData.items[0].volumeInfo
                            const rawImage = vol.imageLinks?.thumbnail ?? vol.imageLinks?.smallThumbnail ?? null
                            return {
                                title: vol.title ?? name,
                                authors: vol.authors ?? [],
                                image: rawImage ? rawImage.replace(/^http:/, 'https:') : null,
                                infoLink: vol.infoLink ?? null,
                            }
                        } catch {
                            return { title: name, authors: [], image: null, infoLink: null }
                        }
                    })
                )

                setRecommendations(bookDetails)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchRecommendations()
    }, [lastBook?.id])

    if (!lastBook) return null

    return (
        <section className="recommendations">
            <h2 className="recommendations__title">Sugerencias para ti</h2>
            <p className="recommendations__subtitle">Basado en «{lastBook.titulo}»</p>

            {loading && (
                <p className="recommendations__loading">Consultando al bibliotecario...</p>
            )}

            {error && (
                <p className="recommendations__error">{error}</p>
            )}

            {!loading && !error && recommendations.length > 0 && (
                <div className="recommendations__grid">
                    {recommendations.map((rec, i) => (
                        <a
                            key={i}
                            className="rec-card"
                            href={rec.infoLink ?? undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="rec-card__cover">
                                {rec.image
                                    ? <img src={rec.image} alt={rec.title} />
                                    : <span className="rec-card__no-cover">Sin portada</span>
                                }
                            </div>
                            <div className="rec-card__info">
                                <p className="rec-card__title">{rec.title}</p>
                                {rec.authors.length > 0 && (
                                    <p className="rec-card__author">{rec.authors.join(', ')}</p>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </section>
    )
}

export default Recommendations
