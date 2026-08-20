import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import './Auth.css'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__branding">
        <div className="auth-page__branding-content">
          <div className="auth-page__logo">
            <div className="auth-page__logo-icon">AI</div>
            <div className="auth-page__logo-text">AI Study</div>
          </div>
          <h1 className="auth-page__tagline">Estudia de forma inteligente.</h1>
          <p className="auth-page__description">
            Convierte tus apuntes en resúmenes, tests y flashcards personalizados con IA.
          </p>
          <div className="auth-page__features">
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">
                <Mail size={20} />
              </div>
              <span>Resúmenes automáticos</span>
            </div>
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">
                <Lock size={20} />
              </div>
              <span>Flashcards interactivas</span>
            </div>
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">
                <Eye size={20} />
              </div>
              <span>Tests personalizados</span>
            </div>
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">
                <Mail size={20} />
              </div>
              <span>Asistente IA 24/7</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-page__form-section">
        <div className="auth-page__form-card">
          <div className="auth-page__form-header">
            <h2 className="auth-page__form-title">Iniciar sesión</h2>
            <p className="auth-page__form-subtitle">Bienvenido de nuevo 👋</p>
          </div>

          {error && (
            <div className="auth-page__error">
              <div className="auth-page__error-icon">
                <Mail size={18} />
              </div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-page__form-group">
              <label className="auth-page__form-label">Email</label>
              <input
                type="email"
                className="auth-page__form-input"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-page__form-group">
              <label className="auth-page__form-label">Contraseña</label>
              <div className="auth-page__password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-page__form-input"
                  placeholder="•••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-page__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-page__btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="auth-page__btn-spinner"></div>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <div className="auth-page__footer">
            ¿No tienes cuenta? <Link to="/register" className="auth-page__footer-link">Regístrate</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
