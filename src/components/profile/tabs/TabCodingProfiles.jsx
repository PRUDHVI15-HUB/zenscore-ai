import React from 'react'
import { Globe, Code, ExternalLink } from 'lucide-react'

export default function TabCodingProfiles({ formData, onChange }) {
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

  const platformFields = [
    { key: 'github', label: 'GitHub Profile', placeholder: 'https://github.com/alexrivera', icon: '🐙' },
    { key: 'linkedin', label: 'LinkedIn Profile', placeholder: 'https://linkedin.com/in/alexrivera', icon: '💼' },
    { key: 'leetcode', label: 'LeetCode Handle / URL', placeholder: 'https://leetcode.com/u/alexrivera', icon: '🧩' },
    { key: 'geeksforgeeks', label: 'GeeksforGeeks Handle', placeholder: 'https://media.geeksforgeeks.org/alexrivera', icon: '🟢' },
    { key: 'codechef', label: 'CodeChef Handle', placeholder: 'https://www.codechef.com/users/alexrivera', icon: '👨‍🍳' },
    { key: 'codeforces', label: 'Codeforces Handle', placeholder: 'https://codeforces.com/profile/alexrivera', icon: '📊' },
    { key: 'hackerrank', label: 'HackerRank Profile', placeholder: 'https://www.hackerrank.com/alexrivera', icon: '🟢' },
    { key: 'codingninjas', label: 'Coding Ninjas Profile', placeholder: 'https://www.codingninjas.com/studio/profile/alexrivera', icon: '🥷' },
    { key: 'portfolioWebsite', label: 'Personal Portfolio Website', placeholder: 'https://alexrivera.dev', icon: '🌐' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
          Coding Profiles & Online Handles
        </h3>
        <p style={{ fontSize: 13, color: '#64748B' }}>
          Connect your competitive programming accounts, GitHub repositories, and professional networks.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {platformFields.map((item) => {
          const val = formData[item.key] || ''
          return (
            <div key={item.key} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={labelStyle}>
                  <span style={{ marginRight: 6 }}>{item.icon}</span>
                  {item.label}
                </label>
                {val && (
                  <a
                    href={val}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', display: 'inline-flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}
                  >
                    Test Link <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <input
                type="text"
                value={val}
                onChange={e => handleChange(item.key, e.target.value)}
                style={inputStyle}
                placeholder={item.placeholder}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
