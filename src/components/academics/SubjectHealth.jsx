/**
 * SubjectHealth.jsx — Premium Subject Grouping Overview (Phase 5)
 *
 * Custom category subheaders, empty states, and responsive grid layouts.
 * All props/callbacks/logic untouched.
 */
import React from 'react'
import SubjectHealthCard from './SubjectHealthCard'

const CategorySubHeader = ({ icon, title, description, color }) => (
  <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 16 }} aria-hidden="true">{icon}</span>
      <h5 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color, margin: 0 }}>
        {title}
      </h5>
    </div>
    <p style={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 500, margin: 0 }}>
      {description}
    </p>
  </div>
)

export default function SubjectHealth({ subjects = [], onEditSubject, onDeleteSubject }) {
  if (!subjects || subjects.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          padding: '40px 24px',
          textAlign: 'center',
          background: '#fff',
          borderRadius: 24,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          maxWidth: 420,
          margin: '32px auto 0',
        }}
      >
        <div style={{ width: 56, height: 56, borderRadius: 16, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
          📚
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
            No subject data evaluated
          </h4>
          <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>
            Log active courses inside your semesters to track live performance metrics.
          </p>
        </div>
      </div>
    )
  }

  // Group by health categories
  const categories = {
    'Needs Work': subjects.filter(s => s.health === 'Needs Work'),
    Healthy: subjects.filter(s => s.health === 'Healthy'),
    Excellent: subjects.filter(s => s.health === 'Excellent'),
    Unknown: subjects.filter(s => !s.health || !['Needs Work', 'Healthy', 'Excellent'].includes(s.health))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* 1. Needs Work Section */}
      {categories['Needs Work'].length > 0 && (
        <div>
          <CategorySubHeader
            icon="⚠️"
            title="Needs Work"
            description="Subjects with low attendance or grades that require immediate focus and study priority"
            color="#DC2626"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {categories['Needs Work'].map(sub => (
              <SubjectHealthCard 
                key={sub.name} 
                subject={sub} 
                health="Needs Work" 
                onEdit={onEditSubject}
                onDelete={onDeleteSubject}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Healthy Section */}
      {categories.Healthy.length > 0 && (
        <div>
          <CategorySubHeader
            icon="📈"
            title="Healthy"
            description="Subjects with consistent attendance records and stable academic margins"
            color="#2563EB"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {categories.Healthy.map(sub => (
              <SubjectHealthCard 
                key={sub.name} 
                subject={sub} 
                health="Healthy" 
                onEdit={onEditSubject}
                onDelete={onDeleteSubject}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. Excellent Section */}
      {categories.Excellent.length > 0 && (
        <div>
          <CategorySubHeader
            icon="🏆"
            title="Excellent"
            description="Outstanding subject standings reflecting stellar marks and class presence"
            color="#059669"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {categories.Excellent.map(sub => (
              <SubjectHealthCard 
                key={sub.name} 
                subject={sub} 
                health="Excellent" 
                onEdit={onEditSubject}
                onDelete={onDeleteSubject}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. Unknown Section */}
      {categories.Unknown.length > 0 && (
        <div>
          <CategorySubHeader
            icon="❓"
            title="Evaluating standing..."
            description="Subjects currently undergoing AI wellness evaluation"
            color="#64748B"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {categories.Unknown.map(sub => (
              <SubjectHealthCard 
                key={sub.name} 
                subject={sub} 
                health="Healthy"
                onEdit={onEditSubject}
                onDelete={onDeleteSubject}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
