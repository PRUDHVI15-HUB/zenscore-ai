import React from 'react'
import { Target, Building2, MapPin, DollarSign, Briefcase } from 'lucide-react'

export default function TabCareerPreferences({ formData, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value })
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

  const workPreferences = ['Remote', 'Hybrid', 'Onsite', 'Flexible / Open']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
          Career Preferences
        </h3>
        <p style={{ fontSize: 13, color: '#64748B' }}>
          Define your placement goals, target engineering roles, salary expectations, and work environment options.
        </p>
      </div>

      {/* Row 1: Target Career & Dream Company */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div>
          <label style={labelStyle}>Target Career Role</label>
          <input
            type="text"
            value={formData.targetCareer || ''}
            onChange={e => handleChange('targetCareer', e.target.value)}
            style={inputStyle}
            placeholder="Full Stack Engineer / AI Specialist"
          />
        </div>
        <div>
          <label style={labelStyle}>Dream Company</label>
          <input
            type="text"
            value={formData.dreamCompany || ''}
            onChange={e => handleChange('dreamCompany', e.target.value)}
            style={inputStyle}
            placeholder="Google, Microsoft, Amazon"
          />
        </div>
      </div>

      {/* Row 2: Location & Salary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div>
          <label style={labelStyle}>Preferred Job Location(s)</label>
          <input
            type="text"
            value={formData.preferredLocation || ''}
            onChange={e => handleChange('preferredLocation', e.target.value)}
            style={inputStyle}
            placeholder="Bengaluru, Hyderabad, Remote"
          />
        </div>
        <div>
          <label style={labelStyle}>Expected Salary Range (CTC)</label>
          <input
            type="text"
            value={formData.expectedSalary || ''}
            onChange={e => handleChange('expectedSalary', e.target.value)}
            style={inputStyle}
            placeholder="₹12L - ₹24L LPA"
          />
        </div>
      </div>

      {/* Row 3: Interested Domains */}
      <div>
        <label style={labelStyle}>Interested Engineering Domains</label>
        <input
          type="text"
          value={formData.interestedDomains || ''}
          onChange={e => handleChange('interestedDomains', e.target.value)}
          style={inputStyle}
          placeholder="Web Development, Artificial Intelligence, System Architecture, Cloud Computing"
        />
      </div>

      {/* Row 4: Work Preference Radio Cards */}
      <div>
        <label style={labelStyle}>Work Environment Preference</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 4 }}>
          {workPreferences.map((pref) => {
            const isSelected = formData.workPreference === pref
            return (
              <button
                type="button"
                key={pref}
                onClick={() => handleChange('workPreference', pref)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 14,
                  border: isSelected ? '2px solid #6366F1' : '1.5px solid #E2E8F0',
                  background: isSelected ? '#EEF2FF' : '#F8FAFC',
                  color: isSelected ? '#4338CA' : '#475569',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 13,
                  fontWeight: isSelected ? 700 : 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                {pref}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
