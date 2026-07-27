import './MainLayout.css'

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <header className="main-layout__header">
        <h1>AI Study</h1>
      </header>

      <main className="main-layout__content">{children}</main>

      <footer className="main-layout__footer">
        <p>AI Study — Productividad académica</p>
      </footer>
    </div>
  )
}

export default MainLayout
