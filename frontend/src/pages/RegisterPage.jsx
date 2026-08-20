import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Check, X } from 'lucide-react'
import './Auth.css'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 'weak', percentage: 0 }
    
    let strength = 0
    if (pwd.length >= 6) strength += 1
    if (pwd.length >= 10) strength += 1
    if (/[A-Z]/.test(pwd)) strength += 1
    if (/[0-9]/.test(pwd)) strength += 1
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1
    
    if (strength <= 2) return { strength: 'weak', percentage: 33 }
    if (strength <= 3) return { strength: 'medium', percentage: 66 }
    return { strength: 'strong', percentage: 100 }
  }

  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    setLoading(true)

    try {
      await register(name, email, password)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data || 'Error al registrar usuario')
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
            <h2 className="auth-page__form-title">Crear cuenta</h2>
            <p className="auth-page__form-subtitle">Empieza a estudiar de forma inteligente.</p>
          </div>

          {error && (
            <div className="auth-page__error">
              <div className="auth-page__error-icon">
                <X size={18} />
              </div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-page__form-group">
              <label className="auth-page__form-label">Nombre</label>
              <input
                type="text"
                className="auth-page__form-input"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                  minLength="6"
                />
                <button
                  type="button"
                  className="auth-page__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && (
                <div className="auth-page__password-strength">
                  <div className={`auth-page__strength-bar auth-page__strength-bar--${passwordStrength.strength}`} style={{ width: `${passwordStrength.percentage}%` }}></div>
                  <span className="auth-page__strength-text">
                    {passwordStrength.strength === 'weak' && 'Débil'}
                    {passwordStrength.strength === 'medium' && 'Media'}
                    {passwordStrength.strength === 'strong' && 'Fuerte'}
                  </span>
                </div>
              )}
            </div>

            <div className="auth-page__form-group">
              <label className="auth-page__form-label">Confirmar contraseña</label>
              <div className="auth-page__password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="auth-page__form-input"
                  placeholder="•••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  className="auth-page__password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && (
                <div className={`auth-page__password-match ${password === confirmPassword ? 'auth-page__password-match--valid' : 'auth-page__password-match--invalid'}`}>
                  {password === confirmPassword ? (
                    <>
                      <Check size={16} />
                      Las contraseñas coinciden
                    </>
                  ) : (
                    <>
                      <X size={16} />
                      Las contraseñas no coinciden
                    </>
                  )}
                </div>
              )}
            </div>

            <button type="submit" className="auth-page__btn" disabled={loading || (password && confirmPassword && password !== confirmPassword)}>
              {loading ? (
                <>
                  <div className="auth-page__btn-spinner"></div>
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </form>

          <div className="auth-page__footer">
            ¿Ya tienes cuenta? <Link to="/login" className="auth-page__footer-link">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
