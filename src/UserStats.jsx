import { useEffect, useState } from 'react'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js'
import { API_URL } from './config'
//import './UserStats.css'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const ESTADO_COLORS = {
    Leido:     { bg: 'rgba(123, 45, 62, 0.85)',  border: '#7b2d3e' },
    Leyendo:   { bg: 'rgba(201, 168, 76, 0.85)', border: '#c9a84c' },
    Pendiente: { bg: 'rgba(92, 64, 51, 0.45)',   border: '#5c4033' },
}

const CHART_FONT = { family: "Georgia, 'Book Antiqua', Palatino, serif" }

const UserStats = () => {
    const [stats, setStats]       = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError]       = useState('')

    useEffect(() => {
        fetch(`${API_URL}/v1/stats`, {
            headers: { Authorization: localStorage.getItem('token') }
        })
            .then(res => {
                if (res.ok) return res.json()
                throw new Error('No se pudieron cargar las estadísticas')
            })
            .then(data => setStats(data))
            .catch(e => setError(e.message))
            .finally(() => setCargando(false))
    }, [])

    if (cargando) return <section className="user-stats"><p className="user-stats__loading">Cargando estadísticas…</p></section>
    if (error)    return <section className="user-stats"><p className="user-stats__error">{error}</p></section>
    if (!stats)   return null

    const { totalLibros, librosLeidos, ratioLeidos, librosPorEstado = [], librosPorGenero = [], calificacionPromediaPorGenero = [] } = stats

    const estadoData = {
        labels:   librosPorEstado.map(e => e._id),
        datasets: [{
            data:            librosPorEstado.map(e => e.count),
            backgroundColor: librosPorEstado.map(e => ESTADO_COLORS[e._id]?.bg  ?? 'rgba(140,116,90,0.6)'),
            borderColor:     librosPorEstado.map(e => ESTADO_COLORS[e._id]?.border ?? '#8c745a'),
            borderWidth: 2,
        }],
    }

    const generoData = {
        labels: librosPorGenero.map(g => g._id),
        datasets: [{
            label: 'Libros',
            data:  librosPorGenero.map(g => g.count),
            backgroundColor: 'rgba(123, 45, 62, 0.7)',
            borderColor:     '#7b2d3e',
            borderWidth: 1.5,
        }],
    }

    const calificacionData = calificacionPromediaPorGenero.length > 0 ? {
        labels: calificacionPromediaPorGenero.map(c => c._id),
        datasets: [{
            label: 'Calificación promedio',
            data:  calificacionPromediaPorGenero.map(c => Number(c.promedio).toFixed(1)),
            backgroundColor: 'rgba(201, 168, 76, 0.7)',
            borderColor:     '#c9a84c',
            borderWidth: 1.5,
        }],
    } : null

    const barOptions = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { bodyFont: CHART_FONT, titleFont: CHART_FONT },
        },
        scales: {
            x: { ticks: { font: CHART_FONT, color: '#5c4033' }, grid: { color: 'rgba(196,168,130,0.3)' } },
            y: { ticks: { font: CHART_FONT, color: '#5c4033' }, grid: { display: false } },
        },
    }

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { font: CHART_FONT, color: '#5c4033', padding: 16 },
            },
            tooltip: { bodyFont: CHART_FONT, titleFont: CHART_FONT },
        },
    }

    return (
        <section className="user-stats">
            <h2 className="user-stats__title">Mis estadísticas</h2>
            <div className="divider">— ✦ —</div>

            <div className="user-stats__cards">
                <div className="stat-card">
                    <span className="stat-card__value">{totalLibros ?? 0}</span>
                    <span className="stat-card__label">Total libros</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__value">{librosLeidos ?? 0}</span>
                    <span className="stat-card__label">Leídos</span>
                </div>
                <div className="stat-card stat-card--accent">
                    <span className="stat-card__value">{ratioLeidos != null ? `${Math.round(ratioLeidos * 100)}%` : '—'}</span>
                    <span className="stat-card__label">Completado</span>
                </div>
            </div>

            <div className="user-stats__charts">
                {librosPorEstado.length > 0 && (
                    <div className="chart-box">
                        <h3 className="chart-box__title">Estado de lectura</h3>
                        <div className="chart-box__canvas chart-box__canvas--doughnut">
                            <Doughnut data={estadoData} options={doughnutOptions} />
                        </div>
                    </div>
                )}

                {librosPorGenero.length > 0 && (
                    <div className="chart-box">
                        <h3 className="chart-box__title">Libros por género</h3>
                        <div className="chart-box__canvas">
                            <Bar data={generoData} options={barOptions} />
                        </div>
                    </div>
                )}

                {calificacionData && (
                    <div className="chart-box chart-box--wide">
                        <h3 className="chart-box__title">Calificación promedio por género</h3>
                        <div className="chart-box__canvas">
                            <Bar
                                data={calificacionData}
                                options={{
                                    ...barOptions,
                                    scales: {
                                        ...barOptions.scales,
                                        x: { ...barOptions.scales.x, max: 5 },
                                    },
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default UserStats
