import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <>
      <Navbar />
      <div className="page-enter" style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 72 }}>🔍</div>
        <h1 style={{ fontFamily: 'Sora,sans-serif', fontSize: 36, fontWeight: 800, color: 'var(--text-dark)' }}>404</h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 400 }}>Oops! This page doesn't exist. Let's get you back on track.</p>
        <button onClick={() => navigate('/')} style={{ height: 46, padding: '0 32px', borderRadius: 14, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15 }}>
          Go Home
        </button>
      </div>
    </>
  )
}