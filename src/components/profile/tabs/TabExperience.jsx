import React from 'react'
import { Briefcase, Trophy, FileCode, Award, Heart, GitBranch, Plus } from 'lucide-react'

export default function TabExperience({ formData, onChange }) {
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

  const textareaStyle = {
    width: '100%',
    minHeight: 80,
    padding: '12px 14px',
    borderRadius: 12,
    border: '1.5px solid #E2E8F0',
    background: '#F8FAFC',
    color: '#0F172A',
    fontSize: 13.5,
    fontFamily: 'Sora, sans-serif',
    outline: 'none',
    resize: 'vertical'
  }

  const sections = [
    { key: 'internships', label: 'Internships & Work Experience', icon: Briefcase, placeholder: 'Software Engineering Intern @ Google (May 2026 - July 2026)\nBuilt real-time telemetry pipelines using Golang and gRPC.' },
    { key: 'hackathons', label: 'Hackathons & Competitions', icon: Trophy, placeholder: 'Winner @ Smart India Hackathon 2025 (1st Place out of 500+ teams)\nDeveloped AI automated transcript processing pipeline.' },
    { key: 'researchPapers', label: 'Research Papers & Publications', icon: FileCode, placeholder: 'Published "Efficient Transformers for Embedded Edge Devices" in IEEE Trans 2026.' },
    { key: 'achievements', label: 'Honors & Achievements', icon: Award, placeholder: 'Rank 120 in LeetCode Weekly Contest 390\nDepartment Topper in 3rd Year CSE (CGPA 9.2).' },
    { key: 'volunteerWork', label: 'Volunteer Work & Leadership', icon: Heart, placeholder: 'President @ ACM Student Chapter\nOrganized national level 48-hour hackathon for 1,200 students.' },
    { key: 'openSource', label: 'Open Source Contributions', icon: GitBranch, placeholder: 'Core Contributor @ React Router & Vite Plugin Ecosystem (15+ merged PRs).' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
          Experience & Key Accomplishments
        </h3>
        <p style={{ fontSize: 13, color: '#64748B' }}>
          Document your internships, hackathon victories, research publications, and open source contributions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {sections.map((sec) => {
          const IconComp = sec.icon
          return (
            <div key={sec.key} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 18, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
                  <IconComp size={15} />
                </div>
                <label style={{ ...labelStyle, marginBottom: 0 }}>{sec.label}</label>
              </div>

              <textarea
                value={formData[sec.key] || ''}
                onChange={e => handleChange(sec.key, e.target.value)}
                placeholder={sec.placeholder}
                style={textareaStyle}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
