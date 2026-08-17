import { useEffect, useMemo, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Layers, Settings, SunMoon, User, Search, Sparkles, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './AppLayout.css'

function AppLayout() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('ai-study-theme')
    return savedTheme || 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('ai-study-theme', theme)
  }, [theme])

  const navItems = useMemo(
    () => [
      { label: 'Dashboard', to: '/', icon: Home },
      { label: 'Asignaturas', to: '/subjects', icon: Layers },
      { label: 'Configuración', to: '/settings', icon: Settings },
    ],
    []
  )

  const activePath = location.pathname

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__logo">AI</div>
          <div>
            <p className="sidebar__name">AI Study</p>
            <p className="sidebar__tag">Plataforma inteligente</p>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.to !== '/settings'
              ? activePath === item.to || (item.to === '/subjects' && activePath.startsWith('/subjects'))
              : activePath === item.to

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`sidebar-item ${isActive ? 'sidebar-item--active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="sidebar__footer">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <SunMoon size={16} />
            <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>

          <div className="sidebar__profile card">
            <div className="sidebar__profile-avatar">
              <User size={20} />
            </div>
            <div>
              <p className="sidebar__profile-name">{user?.name || 'Usuario'}</p>
              <p className="sidebar__profile-role">Estudiante</p>
            </div>
            <button onClick={handleLogout} className="logout-button" title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar card">
          <div>
            <p className="topbar__subtitle">Bienvenido de nuevo</p>
            <h1 className="topbar__title">Donde tu estudio se vuelve inteligente</h1>
          </div>

          <div className="topbar__actions">
            <div className="input-group topbar__search">
              <Search size={18} />
              <input type="search" placeholder="Buscar documentos, asignaturas..." aria-label="Buscar" />
            </div>
            <button className="btn btn-primary topbar__button" type="button">
              <Sparkles size={16} />
              Nuevo documento
            </button>
          </div>
        </header>

        <main className="page-frame">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
