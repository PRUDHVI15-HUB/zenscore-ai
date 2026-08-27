import React from 'react'
import { User, Mail, Phone, Calendar, MapPin, Globe, ShieldAlert, Sparkles } from 'lucide-react'

export default function TabPersonalInfo({ formData, onChange }) {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
          Personal Information
        </h3>
        <p style={{ fontSize: 13, color: '#64748B' }}>
          Manage your personal contact details, identity info, and emergency contacts.
        </p>
      </div>

      {/* Row 1: Name */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div>
          <label style={labelStyle}>First Name</label>
          <input
            type="text"
            value={formData.firstName || ''}
            onChange={e => handleChange('firstName', e.target.value)}
            style={inputStyle}
            placeholder="Alex"
          />
        </div>
        <div>
          <label style={labelStyle}>Last Name</label>
          <input
            type="text"
            value={formData.lastName || ''}
            onChange={e => handleChange('lastName', e.target.value)}
            style={inputStyle}
            placeholder="Rivera"
          />
        </div>
      </div>

      {/* Row 2: Contact Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={e => handleChange('email', e.target.value)}
            style={inputStyle}
            placeholder="alex.rivera@psgtech.edu"
          />
        </div>
        <div>
          <label style={labelStyle}>Phone Number</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={e => handleChange('phone', e.target.value)}
            style={inputStyle}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      {/* Row 3: DOB & Gender */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div>
          <label style={labelStyle}>Date of Birth</label>
          <input
            type="date"
            value={formData.dob || ''}
            onChange={e => handleChange('dob', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Gender</label>
          <select
            value={formData.gender || ''}
            onChange={e => handleChange('gender', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>

      {/* Address Details */}
      <div>
        <label style={labelStyle}>Street Address</label>
        <input
          type="text"
          value={formData.address || ''}
          onChange={e => handleChange('address', e.target.value)}
          style={inputStyle}
          placeholder="123 Tech Campus Road, Peelamedu"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <div>
          <label style={labelStyle}>City</label>
          <input
            type="text"
            value={formData.city || ''}
            onChange={e => handleChange('city', e.target.value)}
            style={inputStyle}
            placeholder="Coimbatore"
          />
        </div>
        <div>
          <label style={labelStyle}>State</label>
          <input
            type="text"
            value={formData.state || ''}
            onChange={e => handleChange('state', e.target.value)}
            style={inputStyle}
            placeholder="Tamil Nadu"
          />
        </div>
        <div>
          <label style={labelStyle}>Country</label>
          <input
            type="text"
            value={formData.country || ''}
            onChange={e => handleChange('country', e.target.value)}
            style={inputStyle}
            placeholder="India"
          />
        </div>
      </div>

      {/* Languages & Emergency */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div>
          <label style={labelStyle}>Languages Spoken</label>
          <input
            type="text"
            value={formData.languages || ''}
            onChange={e => handleChange('languages', e.target.value)}
            style={inputStyle}
            placeholder="English, Tamil, Hindi"
          />
        </div>
        <div>
          <label style={labelStyle}>Emergency Contact (Name & Phone)</label>
          <input
            type="text"
            value={formData.emergencyContact || ''}
            onChange={e => handleChange('emergencyContact', e.target.value)}
            style={inputStyle}
            placeholder="Parent/Guardian (+91 99887 76655)"
          />
        </div>
      </div>
    </div>
  )
}
