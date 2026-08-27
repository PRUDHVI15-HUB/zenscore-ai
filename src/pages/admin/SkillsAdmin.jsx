import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, FolderPlus, BookOpen, Layers, Plus, Edit, Trash2, CheckCircle2, XCircle, ArrowLeft, RefreshCw, Search } from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import { apiFetch } from '../../services/api'

/**
 * Admin Content Management System (CMS) for Skills Module (Step 7)
 * Route: /admin/skills
 */
export default function SkillsAdmin() {
  const [activeTab, setActiveTab] = useState('overview')
  const [analytics, setAnalytics] = useState(null)
  const [categories, setCategories] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  // Form Modals State
  const [showCatModal, setShowCatModal] = useState(false)
  const [catFormData, setCatFormData] = useState({ name: '', icon: '🌐', color: '#EFF6FF', description: '' })

  const [showSkillModal, setShowSkillModal] = useState(false)
  const [skillFormData, setSkillFormData] = useState({ name: '', categoryId: '', difficulty: 'Intermediate', estimatedHours: 12, description: '' })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const loadAdminData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [analyticsRes, catsRes, skillsRes] = await Promise.all([
        apiFetch('/admin/skills/analytics').catch(() => ({ success: false })),
        apiFetch('/skills/categories'),
        apiFetch('/skills?limit=50')
      ])

      if (analyticsRes?.success) setAnalytics(analyticsRes.data)
      if (catsRes?.success) setCategories(catsRes.data)
      if (skillsRes?.success) setSkills(skillsRes.data)
    } catch (err) {
      setError(err?.message || 'Failed to load CMS data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    try {
      const res = await apiFetch('/admin/skills/categories', {
        method: 'POST',
        body: JSON.stringify(catFormData)
      })
      if (res.success) {
        showToast('✓ Skill Category Created!')
        setShowCatModal(false)
        setCatFormData({ name: '', icon: '🌐', color: '#EFF6FF', description: '' })
        loadAdminData()
      }
    } catch (err) {
      showToast(err?.message || 'Failed to create category', 'error')
    }
  }

  const handleCreateSkill = async (e) => {
    e.preventDefault()
    try {
      const res = await apiFetch('/admin/skills', {
        method: 'POST',
        body: JSON.stringify(skillFormData)
      })
      if (res.success) {
        showToast('✓ Skill Created Successfully!')
        setShowSkillModal(false)
        setSkillFormData({ name: '', categoryId: '', difficulty: 'Intermediate', estimatedHours: 12, description: '' })
        loadAdminData()
      }
    } catch (err) {
      showToast(err?.message || 'Failed to create skill', 'error')
    }
  }

  return (
    <AppLayout>
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          background: toast.type === 'error' ? '#EF4444' : 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '14px',
          fontFamily: 'Sora, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: '0 12px 30px -5px rgba(124, 58, 237, 0.45)'
        }}>
          {toast.message}
        </div>
      )}

      {/* Category Creation Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleCreateCategory} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-sora text-base font-bold text-slate-900">Create Skill Category</h3>
            <input
              type="text"
              required
              placeholder="Category Name (e.g. Mobile Development)"
              value={catFormData.name}
              onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
              className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Icon Emoji (e.g. 📱)"
                value={catFormData.icon}
                onChange={(e) => setCatFormData({ ...catFormData, icon: e.target.value })}
                className="w-1/2 h-10 px-3 border border-slate-200 rounded-xl text-xs"
              />
              <input
                type="text"
                placeholder="Hex Color (e.g. #EFF6FF)"
                value={catFormData.color}
                onChange={(e) => setCatFormData({ ...catFormData, color: e.target.value })}
                className="w-1/2 h-10 px-3 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <textarea
              placeholder="Description..."
              value={catFormData.description}
              onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl text-xs"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowCatModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-500">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold">Save Category</button>
            </div>
          </form>
        </div>
      )}

      {/* Skill Creation Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleCreateSkill} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-sora text-base font-bold text-slate-900">Create New Skill</h3>
            <input
              type="text"
              required
              placeholder="Skill Name (e.g. Flutter Development)"
              value={skillFormData.name}
              onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
              className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs"
            />
            <select
              value={skillFormData.categoryId}
              onChange={(e) => setSkillFormData({ ...skillFormData, categoryId: e.target.value })}
              className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs"
            >
              <option value="">Select Category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div className="flex gap-2">
              <select
                value={skillFormData.difficulty}
                onChange={(e) => setSkillFormData({ ...skillFormData, difficulty: e.target.value })}
                className="w-1/2 h-10 px-3 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <input
                type="number"
                placeholder="Est. Hours"
                value={skillFormData.estimatedHours}
                onChange={(e) => setSkillFormData({ ...skillFormData, estimatedHours: Number(e.target.value) })}
                className="w-1/2 h-10 px-3 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <textarea
              placeholder="Skill Description..."
              value={skillFormData.description}
              onChange={(e) => setSkillFormData({ ...skillFormData, description: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl text-xs"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowSkillModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-500">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold">Save Skill</button>
            </div>
          </form>
        </div>
      )}

      <div className="container" style={{ padding: '20px 24px 40px' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Admin Control Panel</span>
            <h1 className="font-sora text-2xl font-extrabold text-slate-900">Skills Module CMS</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCatModal(true)}
              className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-sora font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-purple-600" />
              <span>+ Add Category</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSkillModal(true)}
              className="h-9 px-4 bg-purple-600 hover:bg-purple-700 text-white font-sora font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Skill</span>
            </button>
          </div>
        </div>

        {/* Analytics Summary Cards */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Categories</span>
              <p className="font-sora text-2xl font-extrabold text-slate-900 mt-1">{analytics.totalCategories || categories.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Skills</span>
              <p className="font-sora text-2xl font-extrabold text-slate-900 mt-1">{analytics.totalSkills || skills.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Published Lessons</span>
              <p className="font-sora text-2xl font-extrabold text-slate-900 mt-1">{analytics.totalLessons || 671}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Active Learners</span>
              <p className="font-sora text-2xl font-extrabold text-purple-600 mt-1">{analytics.totalActiveLearners || 12}</p>
            </div>
          </div>
        )}

        {/* Categories & Skills Management Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-sora text-sm font-bold text-slate-900">Manage Published Skills ({skills.length})</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {skills.map((skill) => (
              <div key={skill.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-lg shrink-0">
                    {skill.icon || '⚡'}
                  </div>
                  <div>
                    <h4 className="font-sora text-xs font-bold text-slate-900">{skill.name}</h4>
                    <span className="text-[10px] text-slate-400">{skill.category?.name || 'Engineering'} • {skill.difficulty} • {skill.lessonCount || 11} Lessons</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Published</span>
                  <Link to={`/skills/${skill.id}`} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
                    <Edit className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
