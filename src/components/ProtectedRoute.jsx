import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { sendEmailVerification } from 'firebase/auth'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ProtectedRoute({ children }) {
  const { user, reloadUser, logout, loading } = useAuth()
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Background check: polls Firebase every 3 seconds to auto-redirect when link is clicked
  useEffect(() => {
    let interval
    const isGoogle = user?.providerData.some(p => p.providerId === 'google.com')

    if (user && !isGoogle && !user.emailVerified) {
      interval = setInterval(async () => {
        try {
          await reloadUser()
        } catch (err) {
          console.error('Error auto-reloading verification status:', err)
        }
      }, 3000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [user, reloadUser])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Sora, sans-serif',
        background: 'linear-gradient(135deg, #F0F6FF 0%, #FAF5FF 50%, #F0FDFB 100%)',
        color: 'var(--text-dark)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)', borderRadius: '50%',
            animation: 'spin 1s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ fontSize: 15, fontWeight: 600 }}>Loading session...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const isGoogle = user.providerData.some(p => p.providerId === 'google.com')

  if (!isGoogle && !user.emailVerified) {
    const handleResend = async () => {
      setResending(true)
      setMessage({ type: '', text: '' })
      try {
        await sendEmailVerification(user)
        setMessage({ 
          type: 'success', 
          text: 'Verification email resent! Please check your spam folder if you do not see it.' 
        })
      } catch (error) {
        console.error('Resend verification error:', error)
        setMessage({ 
          type: 'error', 
          text: 'Unable to send. Please wait a moment and try again.' 
        })
      } finally {
        setResending(false)
      }
    }

    const handleCheckVerification = async () => {
      setMessage({ type: '', text: '' })
      try {
        await reloadUser()
      } catch (error) {
        console.error('Verification refresh error:', error)
      }
    }

    return (
      <>
        <Navbar />
        <div style={{
          minHeight: 'calc(100vh - 72px)',
          background: 'linear-gradient(135deg, #F0F6FF 0%, #FAF5FF 50%, #F0FDFB 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '48px 24px',
          fontFamily: 'DM Sans, sans-serif'
        }}>
          <div style={{
            width: '100%', maxWidth: 480,
            background: '#fff', borderRadius: 24,
            padding: '40px',
            border: '1px solid var(--border)',
            boxShadow: '0 12px 48px rgba(15,23,42,0.10)',
            textAlign: 'center'
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: '#EFF6FF', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 24px', color: '#2563EB'
            }}>
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
              </svg>
            </div>

            <h1 style={{
              fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800,
              color: 'var(--text-dark)', marginBottom: 12, letterSpacing: '-0.5px'
            }}>Verify your email</h1>
            
            <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
              We sent a verification link to <strong style={{ color: 'var(--text-dark)' }}>{user.email}</strong>.<br />
              Please click the link in that email to activate your account and gain access to ZenScore AI.
            </p>

            {message.text && (
              <div style={{
                background: message.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                border: message.type === 'success' ? '1px solid #A7F3D0' : '1px solid #FECACA',
                borderRadius: 10, padding: '10px 14px',
                fontSize: 13.5, color: message.type === 'success' ? '#047857' : '#DC2626',
                marginBottom: 20, textAlign: 'left'
              }}>{message.text}</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={handleCheckVerification}
                style={{
                  height: 48, borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                  color: '#fff', fontSize: 15, fontWeight: 700,
                  fontFamily: 'Sora, sans-serif', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(37,99,235,0.25)',
                  transition: 'transform 0.15s, box-shadow 0.18s'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.32)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.25)' }}
              >
                I have verified my email
              </button>

              <button
                onClick={handleResend}
                disabled={resending}
                style={{
                  height: 48, borderRadius: 14,
                  border: '1.5px solid var(--border)', background: '#fff',
                  fontSize: 14.5, fontWeight: 600, fontFamily: 'Sora, sans-serif',
                  color: 'var(--text-dark)', cursor: resending ? 'not-allowed' : 'pointer',
                  opacity: resending ? 0.7 : 1,
                  transition: 'border-color 0.18s'
                }}
              >
                {resending ? 'Resending...' : 'Resend Verification Email'}
              </button>

              <button
                onClick={logout}
                style={{
                  background: 'none', border: 'none', color: '#6B7280',
                  fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
                  marginTop: 8, textDecoration: 'underline'
                }}
              >
                Log Out / Switch Account
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return children
}