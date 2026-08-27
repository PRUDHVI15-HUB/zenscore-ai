import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Lock, Sparkles, Play, Clock, BarChart3, ShieldCheck } from 'lucide-react'

export default function FocusEmptyState({
  onStartFirstSession,
  icon = '🧠',
  title = 'Start your first Focus Session',
  subtitle = 'Complete focused study sessions to unlock advanced productivity analytics and guidance:'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: '#FFFFFF',
        borderRadius: 24,
        padding: '48px 36px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
        maxWidth: 640,
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 24,
          background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontSize: 36,
          margin: '0 auto 20px',
          boxShadow: '0 10px 28px rgba(124, 58, 237, 0.25)'
        }}
      >
        {icon}
      </div>

      <h2
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: 24,
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: 10
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: 14,
          color: '#64748B',
          maxWidth: 460,
          margin: '0 auto 28px',
          lineHeight: 1.5,
          fontFamily: 'DM Sans, sans-serif'
        }}
      >
        {subtitle}
      </p>

      {/* Unlockable Modules List */}
      <div
        style={{
          background: '#F8FAFC',
          borderRadius: 18,
          padding: '20px 24px',
          border: '1px solid #E2E8F0',
          maxWidth: 420,
          margin: '0 auto 32px',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}
      >
        {[
          { label: 'Session History', icon: Clock },
          { label: 'Productivity Insights', icon: BarChart3 },
          { label: 'AI Coach', icon: Sparkles },
          { label: 'Focus Health', icon: ShieldCheck }
        ].map((item) => {
          const ItemIcon = item.icon
          return (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ItemIcon size={16} style={{ color: '#7C3AED' }} />
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 700, color: '#334155' }}>
                  {item.label}
                </span>
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#94A3B8', background: '#FFFFFF', padding: '3px 8px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <Lock size={11} /> Locked
              </span>
            </div>
          )
        })}
      </div>

      {onStartFirstSession && (
        <motion.button
          whileHover={{ scale: 1.02, translateY: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartFirstSession}
          style={{
            height: 46,
            padding: '0 28px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 800,
            fontSize: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 6px 20px rgba(124, 58, 237, 0.25)'
          }}
        >
          <Play size={16} fill="#FFFFFF" />
          <span>Start Focus Session</span>
        </motion.button>
      )}
    </motion.div>
  )
}
