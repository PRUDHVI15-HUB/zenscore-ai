import React from 'react'
import { Settings, Moon, Globe, Bell, Clock, Target, Shield } from 'lucide-react'

export default function TabSettings({ settingsData = {}, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...settingsData, [field]: value })
  }

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }

  const inputStyle = {
    width: '100%',
    height: 44,
    padding: '0 14px',
    borderRadius: 12,
    border: '1.5px solid #E2E8F0',
    background: '#F8FAFC',
    color: '#0F172A',
    fontSize: 14,
    fontFamily: 'Sora, sans-serif',
    outline: 'none',
    transition: 'all 0.15s ease'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
          Platform Settings & User Preferences
        </h3>
        <p style={{ fontSize: 13, color: '#64748B' }}>
          Customize interface themes, notification alerts, study goals, and recruiter privacy controls.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
        {/* Theme Preference */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Moon size={16} className="text-indigo-600" />
            <label style={{ ...labelStyle, marginBottom: 0 }}>Theme Mode</label>
          </div>
          <select
            value={settingsData.theme || 'System'}
            onChange={e => handleChange('theme', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="Light">Light Mode</option>
            <option value="Dark">Dark Mode</option>
            <option value="System">System Default</option>
          </select>
        </div>

        {/* Language Preference */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={16} className="text-indigo-600" />
            <label style={{ ...labelStyle, marginBottom: 0 }}>System Language</label>
          </div>
          <select
            value={settingsData.language || 'English'}
            onChange={e => handleChange('language', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Kannada">Kannada (கன்னட)</option>
          </select>
        </div>

        {/* Daily Study Goal */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={16} className="text-indigo-600" />
            <label style={{ ...labelStyle, marginBottom: 0 }}>Daily Focus Goal</label>
          </div>
          <select
            value={settingsData.dailyGoal || '2 Hours'}
            onChange={e => handleChange('dailyGoal', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="1 Hour">1 Hour / Day</option>
            <option value="2 Hours">2 Hours / Day</option>
            <option value="3 Hours">3 Hours / Day</option>
            <option value="4+ Hours">4+ Hours / Day</option>
          </select>
        </div>

        {/* Reminder Time */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={16} className="text-indigo-600" />
            <label style={{ ...labelStyle, marginBottom: 0 }}>Daily Study Notification Time</label>
          </div>
          <input
            type="time"
            value={settingsData.reminderTime || '09:00'}
            onChange={e => handleChange('reminderTime', e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Toggles: Privacy & Notifications */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 18, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={18} className="text-indigo-600" />
          <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
            Privacy & Recruiter Visibility Controls
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { key: 'recruiterVisible', title: 'Allow Verified Corporate Recruiters to view my Master Profile', desc: 'Top tech employers can discover your readiness metrics and send direct interview invites.' },
            { key: 'showLeaderboard', title: 'Display my rank on the ZenScore National Student Leaderboard', desc: 'Compete with engineering peers across universities for XP badges and rewards.' },
            { key: 'emailAlerts', title: 'Send Weekly Performance Digest to my registered email', desc: 'Receive AI insights on study velocity, upcoming tests, and assignment deadlines.' }
          ].map((item) => {
            const val = settingsData[item.key] !== false
            return (
              <label key={item.key} style={{ display: 'flex', alignItems: 'flex-start', justifyBetween: 'space-between', gap: 14, cursor: 'pointer', padding: '10px 12px', borderRadius: 12, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={val}
                  onChange={e => handleChange(item.key, e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#4F46E5', cursor: 'pointer', marginTop: 2 }}
                />
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
