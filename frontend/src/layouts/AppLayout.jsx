import { useEffect, useMemo, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Layers, Settings, Sun, Moon, User, Search, Sparkles, LogOut, BookOpen, GraduationCap } from 'lucide-react'
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
      { label: 'Dashboard', to: '/', icon: Home, section: 'general' },
      { label: 'Asignaturas', to: '/subjects', icon: Layers, section: 'general' },
      { label: 'Configuración', to: '/settings', icon: Settings, section: 'sistema' },
    ],
    []
  )

  const activePath = location.pathname

  const handleLogout = () => {
    logout()
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">
              <GraduationCap size={24} />
            </div>
            <div className="sidebar__logo-text">AI</div>
          </div>
          <div className="sidebar__brand-info">
            <p className="sidebar__name">AI Study</p>
            <p className="sidebar__tag">Plataforma inteligente</p>
          </div>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__section">
            <span className="sidebar__section-label">General</span>
            {navItems.filter(item => item.section === 'general').map((item) => {
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
          </div>

          <div className="sidebar__section">
            <span className="sidebar__section-label">Sistema</span>
            {navItems.filter(item => item.section === 'sistema').map((item) => {
              const Icon = item.icon
              const isActive = activePath === item.to

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
          </div>
        </nav>

        <div className="sidebar__footer">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>

          <div className="sidebar__profile">
            <div className="sidebar__profile-avatar">
              <User size={20} />
            </div>
            <div className="sidebar__profile-info">
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
          <div className="topbar__greeting">
            <p className="topbar__subtitle">{getGreeting()} 👋</p>
            <h1 className="topbar__title">Continúa con tu estudio y aprovecha tus herramientas de IA</h1>
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
