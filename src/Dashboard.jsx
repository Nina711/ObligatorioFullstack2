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
            navigate("/login")
            return
        }
    }, [])

    useEffect(() => {
        fetch('https://notas-app-backend.vercel.app/v1/notas?page=1&limit=10',
            {
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            }
        )
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                else {
                    if(res.status == 401) {
                        localStorage.removeItem('token')
                        navigate("/login")
                        return
                    }

                }
            })
            .then(data => dispatch(setBooks(data.notas)))
            .catch()
            .finally()
    }, [])

    return (
        <>
            <main className="dashboard">
                <AddBook/>
                <Books />
            </main>
        </>
    )
}

export default Dashboard
