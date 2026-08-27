import React from 'react'
import { FileText, Mail, Phone, MapPin, Globe } from 'lucide-react'

export default function ResumePreview({ resumeData }) {
  if (!resumeData) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: 16, border: '1px dashed #CBD5E1' }}>
        No resume content available to preview.
      </div>
    )
  }

  const candidate = resumeData.candidate || {}
  const summary = resumeData.summary || ''
  const skills = resumeData.skills || []
  const experience = resumeData.experience || []
  const projects = resumeData.projects || []
  const education = resumeData.education || []
  const certifications = resumeData.certifications || []

  return (
    <div style={{
      background: '#FFFFFF',
      color: '#0F172A',
      padding: '36px 40px',
      borderRadius: 16,
      border: '1px solid #E2E8F0',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 13,
      lineHeight: 1.5,
      maxWidth: 800,
      margin: '0 auto'
    }}>
      {/* ── HEADER ── */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #0F172A', paddingBottom: 16, marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          {candidate.name || 'Candidate Name'}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 14, fontSize: 12, color: '#475569', fontWeight: 600 }}>
          {candidate.email && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Mail size={13} /> {candidate.email}
            </span>
          )}
          {candidate.phone && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Phone size={13} /> {candidate.phone}
            </span>
          )}
          {candidate.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={13} /> {candidate.location}
            </span>
          )}
          {candidate.linkedin && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Globe size={13} /> {candidate.linkedin}
            </span>
          )}
          {candidate.github && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Globe size={13} /> {candidate.github}
            </span>
          )}
        </div>
      </div>

      {/* ── PROFESSIONAL SUMMARY ── */}
      {summary && (
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, textTransform: 'uppercase', color: '#0F172A', borderBottom: '1px solid #CBD5E1', paddingBottom: 4, margin: '0 0 8px', letterSpacing: '0.04em' }}>
            Professional Summary
          </h3>
          <p style={{ margin: 0, color: '#334155', fontSize: 12.5, lineHeight: 1.5 }}>
            {summary}
          </p>
        </div>
      )}

      {/* ── TECHNICAL SKILLS ── */}
      {skills.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, textTransform: 'uppercase', color: '#0F172A', borderBottom: '1px solid #CBD5E1', paddingBottom: 4, margin: '0 0 8px', letterSpacing: '0.04em' }}>
            Technical Skills
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.map((skill, idx) => (
              <span key={idx} style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: 6, fontSize: 11.5, fontWeight: 700, color: '#1E293B' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── PROFESSIONAL EXPERIENCE ── */}
      {experience.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, textTransform: 'uppercase', color: '#0F172A', borderBottom: '1px solid #CBD5E1', paddingBottom: 4, margin: '0 0 10px', letterSpacing: '0.04em' }}>
            Professional Experience
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 800, fontSize: 13, color: '#0F172A' }}>
                    {exp.role} <span style={{ fontWeight: 600, color: '#64748B' }}>| {exp.company}</span>
                  </span>
                  <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>{exp.dates || exp.startDate}</span>
                </div>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul style={{ margin: '4px 0 0', paddingLeft: 18, color: '#334155', fontSize: 12 }}>
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} style={{ marginBottom: 2 }}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PROJECTS ── */}
      {projects.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, textTransform: 'uppercase', color: '#0F172A', borderBottom: '1px solid #CBD5E1', paddingBottom: 4, margin: '0 0 10px', letterSpacing: '0.04em' }}>
            Projects
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 800, fontSize: 13, color: '#0F172A' }}>{proj.title}</span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{proj.technologies.join(', ')}</span>
                  )}
                </div>
                <p style={{ margin: '2px 0 0', color: '#334155', fontSize: 12 }}>{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EDUCATION ── */}
      {education.length > 0 && (
        <div>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, textTransform: 'uppercase', color: '#0F172A', borderBottom: '1px solid #CBD5E1', paddingBottom: 4, margin: '0 0 10px', letterSpacing: '0.04em' }}>
            Education
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {education.map((edu, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 800, fontSize: 12.5, color: '#0F172A' }}>
                  {edu.degree} <span style={{ fontWeight: 600, color: '#64748B' }}>- {edu.institution}</span>
                </span>
                <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>{edu.dates || edu.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
