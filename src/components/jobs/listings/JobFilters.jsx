import React from 'react'
import { RotateCcw } from 'lucide-react'

export default function JobFilters({
  typeFilter, setTypeFilter,
  workModeFilter, setWorkModeFilter,
  experienceFilter, setExperienceFilter,
  locationFilter, setLocationFilter,
  categoryFilter, setCategoryFilter,
  minSalaryFilter, setMinSalaryFilter,
  onClearFilters,
  activeFilterCount = 0
}) {
  const selectStyle = {
    height: 38,
    padding: '0 12px',
    borderRadius: 10,
    border: '1px solid #CBD5E1',
    background: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: 600,
    color: '#334155',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif'
  }

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 18,
      padding: 16,
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 10px rgba(15,23,42,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 10,
        alignItems: 'center'
      }}>
        {/* Employment Type */}
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={selectStyle}>
          <option value="All">All Job Types</option>
          <option value="Full Time">Full-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
          <option value="Part Time">Part-Time</option>
        </select>

        {/* Work Mode */}
        <select value={workModeFilter} onChange={(e) => setWorkModeFilter(e.target.value)} style={selectStyle}>
          <option value="All">All Work Modes</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>

        {/* Experience */}
        <select value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)} style={selectStyle}>
          <option value="All">All Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="0–1 Years">0–1 Years</option>
          <option value="1–3 Years">1–3 Years</option>
        </select>

        {/* Location */}
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} style={selectStyle}>
          <option value="All">All Locations</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Pune">Pune</option>
          <option value="Chennai">Chennai</option>
          <option value="Noida">Noida</option>
          <option value="Remote">Remote</option>
        </select>

        {/* Category */}
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={selectStyle}>
          <option value="All">All Categories</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Full Stack">Full Stack</option>
          <option value="DevOps">DevOps</option>
          <option value="AI/ML">AI/ML</option>
          <option value="Data Science">Data Science</option>
          <option value="Cybersecurity">Cybersecurity</option>
        </select>

        {/* Min Salary */}
        <select value={minSalaryFilter} onChange={(e) => setMinSalaryFilter(e.target.value)} style={{ ...selectStyle, borderColor: '#7C3AED', background: '#F5F3FF', color: '#7C3AED', fontWeight: 700 }}>
          <option value="0">Salary: Any</option>
          <option value="3">3 LPA+</option>
          <option value="6">6 LPA+</option>
          <option value="10">10 LPA+</option>
          <option value="20">20 LPA+</option>
        </select>

        {/* Clear Filters Button */}
        <button
          onClick={onClearFilters}
          style={{
            height: 38,
            padding: '0 14px',
            borderRadius: 10,
            background: '#F1F5F9',
            color: '#475569',
            border: '1px solid #CBD5E1',
            cursor: 'pointer',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: 12,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}
        >
          <RotateCcw size={13} />
          <span>Clear Filters</span>
          {activeFilterCount > 0 && (
            <span style={{ fontSize: 10, background: '#7C3AED', color: '#FFFFFF', padding: '1px 6px', borderRadius: 99 }}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
