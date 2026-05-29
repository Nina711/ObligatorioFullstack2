import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setBooks } from './features/bookSlice'
import { useNavigate } from 'react-router'
import AddBook from './AddBook'
import Books from './Books'

const Dashboard = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
            return
        }
    }, [navigate])

    useEffect(() => {
        fetch('https://notas-app-backend.vercel.app/v1/books?page=1&limit=10', {
            headers: {
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
                if (data) dispatch(setBooks(data.books))
            })
            .catch(() => {})
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
                <button onClick={handleLogout} className="btn">Cerrar sesión</button>
            </header>

            <main className="dashboard">
                <AddBook />
                <Books />
            </main>
        </>
    )
}

export default Dashboard
