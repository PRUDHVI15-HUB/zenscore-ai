import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import ZenScoreLogo from '../components/common/ZenScoreLogo'
import { Home, LayoutDashboard, GraduationCap, Briefcase, Cpu, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  const quickLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: '#3B82F6' },
    { label: 'Academics', path: '/academics', icon: GraduationCap, color: '#10B981' },
    { label: 'Careers', path: '/careers', icon: Briefcase, color: '#8B5CF6' },
    { label: 'Skills Hub', path: '/skills', icon: Cpu, color: '#F59E0B' }
  ]

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: 'calc(100vh - 64px)',
          background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          color: '#FFFFFF'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            maxWidth: 580,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 24,
            padding: '48px 36px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(37, 99, 235, 0.3))',
              border: '1px solid rgba(124, 58, 237, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: 36
            }}
          >
            🧭
          </div>

          <h1
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 56,
              fontWeight: 800,
              margin: '0 0 8px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px'
            }}
          >
            404
          </h1>

          <h2
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 20,
              fontWeight: 700,
              color: '#FFFFFF',
              margin: '0 0 12px'
            }}
          >
            Page Not Found
          </h2>

          <p
            style={{
              fontSize: 14.5,
              color: '#94A3B8',
              lineHeight: 1.6,
              margin: '0 0 32px'
            }}
          >
            The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let's get you back into the learning zone!
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                height: 44,
                padding: '0 20px',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                fontSize: 13.5,
                fontWeight: 600,
                fontFamily: 'Sora, sans-serif',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.15s ease'
              }}
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              style={{
                height: 44,
                padding: '0 24px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
                color: '#FFFFFF',
                fontSize: 13.5,
                fontWeight: 700,
                fontFamily: 'Sora, sans-serif',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              <LayoutDashboard size={16} />
              <span>Student Dashboard</span>
            </button>
          </div>

          {/* Quick Hubs */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748B', marginBottom: 12 }}>
              Popular Ecosystem Destinations
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8 }}>
              {quickLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#E2E8F0',
                      textDecoration: 'none',
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <Icon size={14} style={{ color: item.color }} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}