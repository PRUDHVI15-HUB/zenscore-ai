import React, { useState } from 'react'
import { FolderGit2, ExternalLink, GitBranch, Plus, Edit2, Trash2, CheckCircle2, Clock, Archive, X } from 'lucide-react'

export default function TabProjects({ projects = [], onAddProject, onUpdateProject, onDeleteProject }) {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    githubLink: '',
    liveLink: '',
    techStack: '',
    status: 'Completed'
  })

  const defaultProjects = projects.length > 0 ? projects : [
    {
      id: 1,
      title: 'ZenScore AI Student Platform',
      description: 'An AI-powered academic performance and career readiness ecosystem built with React and Node.js.',
      githubLink: 'https://github.com/alexrivera/zenscore-ai',
      liveLink: 'https://zenscore-ai.vercel.app',
      techStack: 'React, Node.js, Express, MongoDB, TailwindCSS',
      status: 'Completed'
    },
    {
      id: 2,
      title: 'Distributed Microservices Bus',
      description: 'Event-driven architecture for low-latency transaction processing using Kafka and Docker.',
      githubLink: 'https://github.com/alexrivera/distributed-bus',
      liveLink: '',
      techStack: 'Go, Kafka, Docker, Redis',
      status: 'Ongoing'
    }
  ]

  const handleOpenAdd = () => {
    setEditingId(null)
    setForm({ title: '', description: '', githubLink: '', liveLink: '', techStack: '', status: 'Completed' })
    setShowModal(true)
  }

  const handleOpenEdit = (proj) => {
    setEditingId(proj.id)
    setForm({
      title: proj.title || '',
      description: proj.description || '',
      githubLink: proj.githubLink || '',
      liveLink: proj.liveLink || '',
      techStack: proj.techStack || '',
      status: proj.status || 'Completed'
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    if (editingId) {
      onUpdateProject && onUpdateProject({ ...form, id: editingId })
    } else {
      onAddProject && onAddProject({ ...form, id: Date.now() })
    }
    setShowModal(false)
  }

  const getStatusBadge = (status) => {
    if (status === 'Completed') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={12} /> Completed
        </span>
      )
    }
    if (status === 'Ongoing') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          <Clock size={12} /> Ongoing
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
        <Archive size={12} /> Archived
      </span>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            Software & Engineering Projects
          </h3>
          <p style={{ fontSize: 13, color: '#64748B' }}>
            Showcase your open source contributions, capstone engineering projects, and live web apps.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
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
          <span>+ Add Project</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
        {defaultProjects.map((proj) => (
          <div
            key={proj.id}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 18,
              padding: '20px 22px',
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
                  {proj.title}
                </h4>
                {getStatusBadge(proj.status)}
              </div>

              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.55 }}>
                {proj.description}
              </p>

              {proj.techStack && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {proj.techStack.split(',').map((tech, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 9px',
                        borderRadius: 8,
                        background: '#F1F5F9',
                        color: '#475569',
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Links & Edit/Delete Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {proj.githubLink && (
                  <a
                    href={proj.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 12, fontWeight: 700, color: '#4F46E5', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                  >
                    <GitBranch size={14} /> GitHub
                  </a>
                )}
                {proj.liveLink && (
                  <a
                    href={proj.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 12, fontWeight: 700, color: '#059669', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => handleOpenEdit(proj)}
                  style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 6, color: '#475569', cursor: 'pointer' }}
                  title="Edit Project"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDeleteProject && onDeleteProject(proj.id)}
                  style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: 6, color: '#EF4444', cursor: 'pointer' }}
                  title="Delete Project"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-extrabold text-slate-800 font-sans">{editingId ? 'Edit Project' : 'Add New Project'}</h4>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. ZenScore Student Platform"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Short explanation of what the project accomplishes..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">GitHub Repository Link</label>
                  <input
                    type="url"
                    value={form.githubLink}
                    onChange={e => setForm({ ...form, githubLink: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Live Demo / URL</label>
                  <input
                    type="url"
                    value={form.liveLink}
                    onChange={e => setForm({ ...form, liveLink: e.target.value })}
                    placeholder="https://..."
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={form.techStack}
                    onChange={e => setForm({ ...form, techStack: e.target.value })}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none cursor-pointer"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
