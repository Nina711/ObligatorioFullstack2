import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setBooks } from './features/bookSlice'
import { useNavigate } from 'react-router'
import { API_URL } from './config'
import AddBook from './AddBook'
import Books from './Books'
import { useSelector } from 'react-redux'
import ChangePlan from './ChangePlan'
import UserStats from './UserStats'
import logo from '../public/logo.svg'
import { setReviews } from './features/reviewSlice'

const Dashboard = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const plan = useSelector(
        state => state.user.plan
    )

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
            return
        }
    }, [navigate])

    useEffect(() => {

        const cargarDatos = async () => {

            try {

                const booksRes = await fetch(
                    `${API_URL}/v1/libros?limite=10&pagina=1`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization:
                                localStorage.getItem('token')
                        }
                    }
                )

                const reviewsRes = await fetch(
                    `${API_URL}/v1/reviews?limite=100&pagina=1`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization:
                                localStorage.getItem('token')
                        }
                    }
                )

                if (booksRes.status === 401) {
                    localStorage.removeItem('token')
                    navigate('/login')
                    return
                }

                const booksData =
                    await booksRes.json()

                const reviewsData =
                    await reviewsRes.json()

                dispatch(
                    setBooks(booksData.libro)
                )

                dispatch(
                    setReviews(reviewsData.reviews)
                )

            } catch {
                console.log('Error')
            }

        }

        cargarDatos()

    }, [dispatch, navigate])

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <>
            <header className="app-header">
                <div className="app-header__brand">
                    <div className="dashboard-logo">
                        <img src={logo} alt="StoryShelf" />
                    </div>
                    <h1 className="app-header__title">StoryShelf</h1>
                </div>
                <ChangePlan />
                <button onClick={handleLogout} className="btn">Cerrar sesión</button>
            </header>

            <main className="dashboard">
                <UserStats />
                <AddBook />
                <Books />
            </main>
        </>
    )
}

export default Dashboard
