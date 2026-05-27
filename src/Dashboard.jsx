import { use, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotas } from './features/notasSlice'
import { useNavigate } from 'react-router'

//for --> htmlFor
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
            .then(data => dispatch(setNotas(data.notas)))
            .catch()
            .finally()
    }, [])

    return (
        <>
            <Nav />
            <main className="dashboard">

                <Estadisticas />
                <Grafico />
                <AddBook/>
                <Notas />

            </main>

            <Footer />
        </>
    )
}

export default Dashboard