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
import './UserStats.css'

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
)

const ESTADO_COLORS = {
    Leido: {
        bg: 'rgba(124,108,242,.85)',
        border: '#7C6CF2'
    },
    Leyendo: {
        bg: 'rgba(167,139,250,.85)',
        border: '#A78BFA'
    },
    Pendiente: {
        bg: 'rgba(203,213,225,.9)',
        border: '#CBD5E1'
    }
}

const CHART_FONT = {
    family: 'Inter, system-ui, sans-serif'
}

const TOOLTIP_OPTIONS = {
    bodyFont: CHART_FONT,
    titleFont: CHART_FONT,

    backgroundColor: '#F8F7FC',

    titleColor: '#111827',
    bodyColor: '#374151',

    borderColor: '#DDD6FE',
    borderWidth: 1,

    cornerRadius: 12,
    padding: 12,
}

const UserStats = () => {
    const [stats, setStats] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch(`${API_URL}/v1/stats`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then(res => {
                if (res.ok) return res.json()
                throw new Error('No se pudieron cargar las estadísticas')
            })
            .then(data => setStats(data))
            .catch(e => setError(e.message))
            .finally(() => setCargando(false))
    }, [])

    if (cargando) {
        return (
            <section className="user-stats">
                <p className="user-stats__loading">
                    Cargando estadísticas...
                </p>
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

    const {
        totalLibros,
        librosLeidos,
        ratioLeidos,
        librosPorEstado = [],
        librosPorGenero = [],
        calificacionPromediaPorGenero = []
    } = stats

    const estadoData = {
        labels: librosPorEstado.map(e => e.estado),
        datasets: [
            {
                data: librosPorEstado.map(e => e.total),
                backgroundColor: librosPorEstado.map(
                    e =>
                        ESTADO_COLORS[e.estado]?.bg ??
                        'rgba(124,108,242,.4)'
                ),
                borderColor: librosPorEstado.map(
                    e =>
                        ESTADO_COLORS[e.estado]?.border ??
                        '#7C6CF2'
                ),
                borderWidth: 2,
            },
        ],
    }

    const generoData = {
        labels: librosPorGenero.map(g => g.genero),
        datasets: [
            {
                label: 'Libros',
                data: librosPorGenero.map(g => g.total),
                backgroundColor: [
                    '#7C6CF2',
                    '#A78BFA',
                    '#C4B5FD',
                    '#DDD6FE',
                    '#EDE9FE'
                ],
                borderColor: '#6D5DF0',
                borderWidth: 1.5,
            },
        ],
    }

    const calificacionData =
        calificacionPromediaPorGenero.length > 0
            ? {
                labels: calificacionPromediaPorGenero.map(
                    c => c.genero
                ),
                datasets: [
                    {
                        label: 'Calificación promedio',
                        data:
                            calificacionPromediaPorGenero.map(
                                c =>
                                    Number(
                                        c.promedioCalificacion
                                    )
                            ),
                        backgroundColor: '#7C6CF2',
                        borderColor: '#5B4EE8',
                        borderWidth: 1.5,
                    },
                ],
            }
            : null

    const barOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: TOOLTIP_OPTIONS,
        },
        scales: {
            x: {
                ticks: {
                    font: CHART_FONT,
                    color: '#6B7280',
                },
                grid: {
                    color: 'rgba(124,108,242,.12)',
                },
            },
            y: {
                ticks: {
                    font: CHART_FONT,
                    color: '#6B7280',
                },
                grid: {
                    display: false,
                },
            },
        },
    }

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: CHART_FONT,
                    color: '#6B7280',
                    padding: 16,
                },
            },
            tooltip: TOOLTIP_OPTIONS,
        },
    }

    return (
        <section className="user-stats">
            <h2 className="user-stats__title">
                Mis estadísticas
            </h2>

            <div className="user-stats__cards">
                <div className="stat-card">
                    <span className="stat-card__value">
                        {totalLibros ?? 0}
                    </span>
                    <span className="stat-card__label">
                        Total libros
                    </span>
                </div>

                <div className="stat-card">
                    <span className="stat-card__value">
                        {librosLeidos ?? 0}
                    </span>
                    <span className="stat-card__label">
                        Leídos
                    </span>
                </div>

                <div className="stat-card">
                    <span className="stat-card__value">
                        {ratioLeidos != null
                            ? `${Math.round(
                                ratioLeidos * 100
                            )
                            }% `
                            : '—'}
                    </span>
                    <span className="stat-card__label">
                        Completado
                    </span>
                </div>
            </div>

            <div className="user-stats__charts">
                {librosPorEstado.length > 0 && (
                    <div className="chart-box">
                        <h3 className="chart-box__title">
                            Estado de lectura
                        </h3>

                        <div className="chart-box__canvas chart-box__canvas--doughnut">
                            <Doughnut
                                data={estadoData}
                                options={doughnutOptions}
                            />
                        </div>
                    </div>
                )}

                {librosPorGenero.length > 0 && (
                    <div className="chart-box">
                        <h3 className="chart-box__title">
                            Libros por género
                        </h3>

                        <div className="chart-box__canvas">
                            <Bar
                                data={generoData}
                                options={barOptions}
                            />
                        </div>
                    </div>
                )}

                {calificacionData && (
                    <div className="chart-box chart-box--wide">
                        <h3 className="chart-box__title">
                            Calificación promedio por género
                        </h3>

                        <div className="chart-box__canvas">
                            <Bar
                                data={calificacionData}
                                options={{
                                    ...barOptions,
                                    scales: {
                                        ...barOptions.scales,
                                        x: {
                                            ...barOptions.scales.x,
                                            max: 5,
                                        },
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
