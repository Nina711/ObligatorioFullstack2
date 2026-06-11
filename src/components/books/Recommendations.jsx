import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { API_URL } from '../../config/config'
import '../../styles/Recommendations.css'

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
        const data = await res.json()
        console.log('API sugerencia response:', JSON.stringify(data))

        setRecommendations([{
          title: data.sugerencia ?? '',
          image: data.imagenURL?.thumbnail ?? data.imagenURL?.smallThumbnail ?? null,
          authors: [],
          infoLink: null
        }])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [lastBook?.id])

  return (
    <section className="recommendations">
      <h2 className="recommendations__title">Libro recomendado en base a tu última lectura</h2>
      <p className="recommendations__subtitle">Basado en «{lastBook?.titulo}»</p>

      {loading && <p className="recommendations__loading">Consultando al bibliotecario...</p>}
      {error && <p className="recommendations__error">{error}</p>}

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
