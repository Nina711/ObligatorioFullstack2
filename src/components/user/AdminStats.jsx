import { useEffect, useState } from 'react'
import { API_URL } from '../../config/config.js'
import '../../styles/UserStats.css'
import '../../styles/AdminStats.css'
import Paginate from '../common/Paginate.jsx'

const AdminStats = () => {
    const [stats, setStats] = useState(null)
    const [usuarios, setUsuarios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [pagination, setPagination] = useState({
        total: 0,
        totalPaginas: 1
    })

    const cargarUsuarios = async (paginaActual = 1) => {

        const token = localStorage.getItem('token')

        const res = await fetch(
            `${API_URL}/v1/admin/usuarios?limite=10&pagina=${paginaActual}`,
            {
                headers: {
                    Authorization: token
                }
            }
        )

        if (!res.ok) {
            throw new Error(
                'No se pudieron cargar los usuarios'
            )
        }

        return await res.json()
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        const headers = { Authorization: token }

        Promise.all([
            fetch(`${API_URL}/v1/admin/stats`, { headers }).then(r => {
                if (r.ok) return r.json()
                throw new Error('No se pudieron cargar las estadísticas')
            }),
            cargarUsuarios(1)
        ])
            .then(([statsData, usuariosData]) => {
                setStats(statsData)
                setUsuarios(usuariosData.usuariosTodos ?? [])
                setPagination({
                    total: usuariosData.total,
                    totalPaginas: usuariosData.totalPaginas
                })
            })
            .catch(e => setError(e.message))
            .finally(() => setCargando(false))
    }, [])

    if (cargando) {
        return (
            <section className="user-stats">
                <p className="user-stats__loading">Cargando estadísticas...</p>
            </section>
        )
    }

    if (error) {
        return (
            <section className="user-stats">
                <p className="user-stats__error">{error}</p>
            </section>
        )
    }

    if (!stats) return null

    const obtenerPaginaUsuarios = async (
        numeroPagina
    ) => {

        try {

            const data =
                await cargarUsuarios(numeroPagina)

            setUsuarios(
                data.usuariosTodos ?? []
            )

            setPagination({
                total: data.total,
                totalPaginas: data.totalPaginas
            })

        } catch (e) {

            setError(e.message)

        }
    }

    const { totalUsuarios, totalLibros, totalLibrosLeidos } = stats

    return (
        <section className="user-stats">
            <h2 className="user-stats__title">Panel de administración</h2>

            <div className="user-stats__cards">
                <div className="stat-card">
                    <span className="stat-card__value">{totalUsuarios ?? 0}</span>
                    <span className="stat-card__label">Usuarios registrados</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__value">{totalLibros ?? 0}</span>
                    <span className="stat-card__label">Libros en la plataforma</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__value">{totalLibrosLeidos ?? 0}</span>
                    <span className="stat-card__label">Libros leídos por usuarios</span>
                </div>
            </div>

            {usuarios.length > 0 && (
                <div className="admin-table-box">
                    <h3 className="chart-box__title">Usuarios registrados</h3>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Usuario</th>
                                    <th>Email</th>
                                    <th>Plan</th>
                                    <th>Registro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u._id}>
                                        <td>{u.nombre} {u.apellido}</td>
                                        <td>{u.nombreUsuario}</td>
                                        <td>{u.mail}</td>
                                        <td>
                                            <span className={`admin-table__badge admin-table__badge--${u.plan?.toLowerCase()}`}>
                                                {u.plan}
                                            </span>
                                        </td>
                                        <td>{new Date(u.createdAt).toLocaleDateString('es-UY')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Paginate
                        totalPaginas={pagination.totalPaginas}
                        onPageChange={obtenerPaginaUsuarios}
                    />
                </div>
            )}
        </section>
    )
}

export default AdminStats
