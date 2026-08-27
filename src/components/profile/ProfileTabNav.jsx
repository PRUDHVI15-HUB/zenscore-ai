import React from 'react'
import { motion } from 'framer-motion'
import { User, GraduationCap, Target, Sparkles, FolderGit2, Award, Globe, FileText, Briefcase, Settings } from 'lucide-react'

export const PROFILE_TABS = [
  { id: 'personal', label: 'Personal Information', icon: User },
  { id: 'academics', label: 'Academic Information', icon: GraduationCap },
  { id: 'career', label: 'Career Preferences', icon: Target },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'coding', label: 'Coding Profiles', icon: Globe },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'settings', label: 'Settings', icon: Settings }
]

export default function ProfileTabNav({ activeTab, setActiveTab }) {
  return (
    <div
      className="w-full overflow-x-auto no-scrollbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 4px',
        background: 'var(--bg-soft, #FFFFFF)',
        borderRadius: 18,
        border: '1px solid var(--border, #E2E8F0)',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
        marginTop: 20,
        marginBottom: 24
      }}
    >
      {PROFILE_TABS.map((t) => {
        const isActive = activeTab === t.id
        const IconComp = t.icon
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              position: 'relative',
              height: 40,
              padding: '0 16px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              color: isActive ? '#6366F1' : '#64748B',
              fontFamily: 'Sora, sans-serif',
              fontWeight: isActive ? 700 : 600,
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            {isActive && (
              <motion.div
                layoutId="profileTabIndicator"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 12,
                  background: '#EEF2FF',
                  border: '1.5px solid #C7D2FE',
                  zIndex: 0
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 7 }}>
              <IconComp size={15} style={{ color: isActive ? '#6366F1' : '#94A3B8' }} />
              {t.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
