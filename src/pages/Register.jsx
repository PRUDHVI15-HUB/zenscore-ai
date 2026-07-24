import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Register() {
  const { loginWithGoogle, registerWithEmail } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError('')
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      setError('Google sign-up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Custom step-by-step validation helper
  const validatePasswordStrength = (password) => {
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)

    if (!hasUppercase) {
      return 'Password must contain at least one uppercase letter (A-Z).'
    }
    if (!hasLowercase) {
      return 'Password must contain at least one lowercase letter (a-z).'
    }
    if (!hasNumber) {
      return 'Password must contain at least one numeric digit (0-9).'
    }
    if (!hasSpecial) {
      return 'Password must contain at least one special character (e.g. @, $, !, %, *, #).'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    // Run password strength checks
    const passwordError = validatePasswordStrength(form.password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    setLoading(true)
    try {
      await registerWithEmail(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration error:', err)
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already registered. Please go to the Login page instead.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else {
        setError('Failed to create account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', height: 48, padding: '0 48px 0 16px',
    border: '1.5px solid var(--border)', borderRadius: 12,
    fontSize: 14.5, color: 'var(--text-dark)', background: '#fff',
    outline: 'none', fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 0.18s, box-shadow 0.18s'
  }

  const labelStyle = {
    display: 'block', fontSize: 13.5, fontWeight: 600,
    color: 'var(--text-mid)', marginBottom: 6,
    fontFamily: 'Sora, sans-serif'
  }

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: 'calc(100vh - 72px)',
        background: 'linear-gradient(135deg, #F0F6FF 0%, #FAF5FF 50%, #F0FDFB 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 16px'
      }}>
        <div style={{
          width: '100%', maxWidth: 480,
          background: '#fff', borderRadius: 24,
          padding: '32px 24px 28px',
          border: '1px solid var(--border)',
          boxShadow: '0 12px 48px rgba(15,23,42,0.10)'
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link to="/" style={{
              fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 20,
              color: 'var(--primary)', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
              ZenScore <span style={{ color: 'var(--accent2)' }}>AI</span>
            </Link>
            <h1 style={{
              fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800,
              color: 'var(--text-dark)', marginBottom: 8, letterSpacing: '-0.5px'
            }}>Create your account</h1>
            <p style={{ fontSize: 14.5, color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
              >Login</Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: 10, padding: '10px 14px',
              fontSize: 13.5, color: '#DC2626', marginBottom: 20
            }}>{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  name="name" type="text" placeholder="Prudhvi Kumar"
                  value={form.name} onChange={handleChange}
                  style={{ ...inputStyle, paddingRight: 16 }}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  name="email" type="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                  style={{ ...inputStyle, paddingRight: 16 }}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Min. 6 characters"
                    value={form.password} onChange={handleChange}
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)' }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="confirm" 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    placeholder="Re-enter password"
                    value={form.confirm} onChange={handleChange}
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)' }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Create Account Button */}
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  height: 48, borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                  color: '#fff', fontSize: 15, fontWeight: 700,
                  fontFamily: 'Sora, sans-serif', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(37,99,235,0.25)',
                  transition: 'transform 0.15s, box-shadow 0.18s', marginTop: 4,
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.32)' } }}
                onMouseLeave={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.25)' } }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            style={{
              width: '100%', height: 48, borderRadius: 20,
              border: '1.5px solid var(--border)', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontSize: 14.5, fontWeight: 600, fontFamily: 'Sora, sans-serif',
              color: 'var(--text-dark)', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'box-shadow 0.18s, border-color 0.18s',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = '#CBD5E1' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing up...' : 'Continue with Google'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--text-light)', marginTop: 20, lineHeight: 1.6 }}>
            By creating an account you agree to our{' '}
            <a href="#" style={{ color: 'var(--primary)' }}>Terms of Service</a> and{' '}
            <a href="#" style={{ color: 'var(--primary)' }}>Privacy Policy</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}