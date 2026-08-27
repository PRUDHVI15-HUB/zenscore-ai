import React, { useState } from 'react'
import { Sparkles, CheckCircle2, Plus, ShieldCheck, BookOpen, Code, Award, X } from 'lucide-react'

export default function TabSkills({ verifiedSkills = [], customSkills = [], onAddCustomSkill, onDeleteCustomSkill }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend')
  const [newSkillProficiency, setNewSkillProficiency] = useState('Intermediate')

  const defaultVerifiedSkills = verifiedSkills.length > 0 ? verifiedSkills : [
    { name: 'Data Structures & Algorithms', level: 'Advanced', source: 'ZenScore Assessment', sourceType: 'Assessment', date: 'Jul 2026' },
    { name: 'React.js & Redux', level: 'Expert', source: 'Course: Fullstack Masterclass', sourceType: 'Course', date: 'Jun 2026' },
    { name: 'Node.js & Express', level: 'Advanced', source: 'Project: E-Commerce Microservice', sourceType: 'Project', date: 'May 2026' },
    { name: 'Python & FastApi', level: 'Intermediate', source: 'Course: Python for Engineers', sourceType: 'Course', date: 'Apr 2026' },
    { name: 'PostgreSQL & SQL', level: 'Advanced', source: 'ZenScore Assessment', sourceType: 'Assessment', date: 'Mar 2026' },
    { name: 'Docker & Kubernetes', level: 'Intermediate', source: 'Project: Cloud DevOps Pipeline', sourceType: 'Project', date: 'Jan 2026' }
  ]

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!newSkillName.trim()) return
    onAddCustomSkill({
      id: Date.now(),
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillProficiency,
      isCustom: true
    })
    setNewSkillName('')
    setShowAddModal(false)
  }

  const getSourceIcon = (type) => {
    if (type === 'Course') return <BookOpen size={13} className="text-indigo-500" />
    if (type === 'Project') return <Code size={13} className="text-purple-500" />
    return <Award size={13} className="text-emerald-500" />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            Skills & Competencies
          </h3>
          <p style={{ fontSize: 13, color: '#64748B' }}>
            Verified skills are automatically updated via assessments, projects, and completed courses.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '10px 18px',
            borderRadius: 12,
            background: '#6366F1',
            color: '#FFFFFF',
            border: 'none',
            fontFamily: 'Sora, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
          }}
        >
          <Plus size={16} />
          <span>+ Add Custom Skill</span>
        </button>
      </div>

      {/* Verified Skills Section (Read Only System Verification) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <ShieldCheck size={16} style={{ color: '#10B981' }} />
          <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#047857' }}>
            Verified Skills (System Audited)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {defaultVerifiedSkills.map((skill, idx) => (
            <div
              key={idx}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 16,
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                  {skill.name}
                </div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: 20,
                    background: '#ECFDF5',
                    color: '#059669',
                    border: '1px solid #A7F3D0'
                  }}
                >
                  <CheckCircle2 size={12} /> Verified
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Level: <strong style={{ color: '#4338CA' }}>{skill.level}</strong></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#475569', fontSize: 11.5, fontWeight: 500 }}>
                  {getSourceIcon(skill.sourceType)}
                  {skill.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Manually Added Skills Section */}
      {customSkills && customSkills.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Sparkles size={16} style={{ color: '#6366F1' }} />
            <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#4338CA' }}>
              Custom Skills (Self-Reported)
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {customSkills.map((sk) => (
              <div
                key={sk.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  borderRadius: 12,
                  background: '#EEF2FF',
                  border: '1px solid #C7D2FE',
                  color: '#3730A3',
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                <span>{sk.name}</span>
                <span style={{ fontSize: 10, background: '#FFFFFF', padding: '2px 6px', borderRadius: 6, color: '#4338CA' }}>
                  {sk.level}
                </span>
                {onDeleteCustomSkill && (
                  <button
                    onClick={() => onDeleteCustomSkill(sk.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366F1', display: 'flex', padding: 0 }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-extrabold text-slate-800 font-sans">Add Custom Skill</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  placeholder="e.g. Next.js, GraphQL, Rust"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select
                    value={newSkillCategory}
                    onChange={e => setNewSkillCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none cursor-pointer"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Core CS">Core CS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Proficiency Level</label>
                  <select
                    value={newSkillProficiency}
                    onChange={e => setNewSkillProficiency(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
