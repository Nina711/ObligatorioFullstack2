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
import AdminStats from './AdminStats'
import ThemeToggle from './ThemeToggle'
import logo from '../public/logo.svg'
import { setReviews } from './features/reviewSlice'

const Dashboard = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const rol = useSelector(state => state.user.rol)

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
            return
        }
    }, [navigate])

    useEffect(() => {

        const cargarDatos = async () => {

            try {

                const reviewsRes = await fetch(
                    `${API_URL}/v1/reviews?limite=4&pagina=1`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization:
                                localStorage.getItem('token')
                        }
                    }
                )

                if (reviewsRes.status === 401) {
                    localStorage.removeItem('token')
                    navigate('/login')
                    return
                }

                const reviewsData =
                    await reviewsRes.json()

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
                {rol !== 'Admin' && <ChangePlan />}
                <ThemeToggle />
                <button onClick={handleLogout} className="btn">Cerrar sesión</button>
            </header>

            <main className="dashboard">
                {rol === 'Admin' ? (
                    <AdminStats />
                ) : (
                    <>
                        <UserStats />
                        <AddBook />
                        <Books />
                    </>
                )}
            </main>
        </>
    )
}

export default Dashboard
