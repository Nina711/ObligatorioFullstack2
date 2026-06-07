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
        fetch(`${API_URL}/v1/libros?limite=10&pagina=1`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token'),
            },
        })
            .then(res => {
                if (res.ok) return res.json()
                if (res.status === 401) {
                    localStorage.removeItem('token')
                    navigate('/login')
                }
            })
            .then(data => {
                if (data) dispatch(setBooks(data.libro))
            })
            .catch(() => { })
    }, [dispatch, navigate])

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <>
            <header className="app-header">
                <div className="app-header__brand">
                    <span className="app-header__ornament">📚</span>
                    <h1 className="app-header__title">Mi Biblioteca</h1>
                    <span className="app-header__ornament">📚</span>
                </div>
                <ChangePlan />
                <button onClick={handleLogout} className="btn">Cerrar sesión</button>
            </header>

            <main className="dashboard">
                <AddBook />
                <Books />
                <UserStats />
            </main>
        </>
    )
}

export default Dashboard
