import { useEffect, useState } from 'react'
import { API_URL } from './config'
import './styles/UserStats.css'
import './styles/AdminStats.css'

const AdminStats = () => {
    const [stats, setStats] = useState(null)
    const [usuarios, setUsuarios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        const headers = { Authorization: token }

        Promise.all([
            fetch(`${API_URL}/v1/admin/stats`, { headers }).then(r => {
                if (r.ok) return r.json()
                throw new Error('No se pudieron cargar las estadísticas')
            }),
            fetch(`${API_URL}/v1/admin/usuarios?limite=50&pagina=1`, { headers }).then(r => {
                if (r.ok) return r.json()
                throw new Error('No se pudieron cargar los usuarios')
            })
        ])
            .then(([statsData, usuariosData]) => {
                setStats(statsData)
                setUsuarios(usuariosData.usuariosTodos ?? [])
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
                </div>
            )}
        </section>
    )
}

export default AdminStats
