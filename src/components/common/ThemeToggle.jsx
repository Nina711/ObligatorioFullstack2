import { useState, useEffect } from 'react'
import '../../styles/ThemeToggle.css'

const ThemeToggle = () => {
    const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
        localStorage.setItem('theme', dark ? 'dark' : 'light')
    }, [dark])

    return (
        <label className="theme-toggle" title={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
            <input
                type="checkbox"
                className="theme-toggle__input"
                checked={dark}
                onChange={() => setDark(d => !d)}
            />
            <span className="theme-toggle__track">
                <span className="theme-toggle__thumb">
                    {dark ? '🌙' : '☀️'}
                </span>
            </span>
        </label>
    )
}

export default ThemeToggle
