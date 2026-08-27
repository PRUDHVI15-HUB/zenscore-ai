import React from 'react'
import { GraduationCap, Award, BookOpen } from 'lucide-react'

export default function TabAcademicInfo({ formData, onChange }) {
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

  const branchesList = ['Computer Science & Engineering', 'Electronics & Communication', 'Electrical & Electronics', 'Information Technology', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Data Science', 'AI & ML']
  const degreesList = ['B.Tech / B.E.', 'M.Tech / M.E.', 'B.Sc / BCA', 'MCA / M.Sc', 'Dual Degree']
  const semestersList = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester']
  const yearsList = ['1st Year', '2nd Year', '3rd Year', '4th Year']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
          Academic Information
        </h3>
        <p style={{ fontSize: 13, color: '#64748B' }}>
          Official institutional records, degree status, semester progress, and GPA metrics.
        </p>
      </div>

      {/* Row 1: Institution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div>
          <label style={labelStyle}>College Name</label>
          <input
            type="text"
            value={formData.college || ''}
            onChange={e => handleChange('college', e.target.value)}
            style={inputStyle}
            placeholder="PSG College of Technology"
          />
        </div>
        <div>
          <label style={labelStyle}>Affiliated University</label>
          <input
            type="text"
            value={formData.university || ''}
            onChange={e => handleChange('university', e.target.value)}
            style={inputStyle}
            placeholder="Anna University"
          />
        </div>
      </div>

      {/* Row 2: Degree & Branch */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div>
          <label style={labelStyle}>Degree</label>
          <select
            value={formData.degree || ''}
            onChange={e => handleChange('degree', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">Select Degree</option>
            {degreesList.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Branch / Specialization</label>
          <select
            value={formData.branch || ''}
            onChange={e => handleChange('branch', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">Select Branch</option>
            {branchesList.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* Row 3: Year, Semester & Roll Number */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <div>
          <label style={labelStyle}>Academic Year</label>
          <select
            value={formData.year || ''}
            onChange={e => handleChange('year', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">Select Year</option>
            {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Current Semester</label>
          <select
            value={formData.semester || ''}
            onChange={e => handleChange('semester', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">Select Semester</option>
            {semestersList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Roll / Registration Number</label>
          <input
            type="text"
            value={formData.rollNumber || ''}
            onChange={e => handleChange('rollNumber', e.target.value)}
            style={inputStyle}
            placeholder="20CSE042"
          />
        </div>
      </div>

      {/* Row 4: Graduation Year, CGPA, Attendance, Backlogs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <div>
          <label style={labelStyle}>Graduation Year</label>
          <input
            type="number"
            value={formData.graduationYear || '2026'}
            onChange={e => handleChange('graduationYear', e.target.value)}
            style={inputStyle}
            placeholder="2026"
          />
        </div>
        <div>
          <label style={labelStyle}>Cumulative CGPA</label>
          <input
            type="text"
            value={formData.cgpa || ''}
            onChange={e => handleChange('cgpa', e.target.value)}
            style={inputStyle}
            placeholder="8.92"
          />
        </div>
        <div>
          <label style={labelStyle}>Overall Attendance (%)</label>
          <input
            type="text"
            value={formData.attendance || ''}
            onChange={e => handleChange('attendance', e.target.value)}
            style={inputStyle}
            placeholder="94.5%"
          />
        </div>
        <div>
          <label style={labelStyle}>Active Backlogs</label>
          <input
            type="number"
            value={formData.backlogs || '0'}
            onChange={e => handleChange('backlogs', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  )
}
