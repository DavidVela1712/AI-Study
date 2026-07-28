import { Outlet, Link, useLocation } from 'react-router-dom'
import './AppLayout.css'

function AppLayout() {
  const location = useLocation()

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header__content">
          <Link to="/" className="app-header__logo">
            <h1>AI Study</h1>
          </Link>
        </div>
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <nav className="app-nav">
            <Link 
              to="/" 
              className={`app-nav__item ${location.pathname === '/' ? 'app-nav__item--active' : ''}`}
            >
              <span className="app-nav__icon">📚</span>
              <span>Mis Asignaturas</span>
            </Link>
          </nav>
        </aside>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
