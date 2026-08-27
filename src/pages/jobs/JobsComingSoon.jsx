import React from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import { ArrowLeft, Sparkles, Clock } from 'lucide-react'

export default function JobsComingSoon({ title = 'Feature Coming Soon', description = 'We are working hard to bring this module to life. Stay tuned!' }) {
  const navigate = useNavigate()

  return (
    <AppLayout>
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center', margin: '0 auto', maxWidth: 600 }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: 24,
          padding: '48px 32px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            color: '#7C3AED',
            border: '1px solid #DDD6FE'
          }}>
            🚀
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 20,
            background: '#F5F3FF',
            color: '#7C3AED',
            fontSize: 11.5,
            fontWeight: 800
          }}>
            <Sparkles size={13} />
            <span>ZENCORE AI JOBS MODULE</span>
          </div>

          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {title}
          </h1>

          <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            {description}
          </p>

          <button
            onClick={() => navigate('/jobs')}
            style={{
              marginTop: 12,
              height: 42,
              padding: '0 24px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: 13.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Jobs Portal</span>
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
