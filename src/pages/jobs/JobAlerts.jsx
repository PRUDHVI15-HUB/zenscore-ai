import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import {
  getJobAlerts,
  createJobAlert,
  updateJobAlert,
  deleteJobAlert,
  toggleJobAlert
} from '../../services/api'

import {
  Bell, BellOff, Mail, Sparkles, Plus, Edit2, Trash2, CheckCircle2, XCircle,
  Briefcase, MapPin, DollarSign, Filter, Search, RotateCcw, AlertTriangle, X
} from 'lucide-react'

import JobsSubNavHeader from '../../components/jobs/navigation/JobsSubNavHeader'

export default function JobAlertsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAlert, setEditingAlert] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    keywords: '',
    category: 'All',
    company: '',
    location: '',
    workMode: 'All',
    employmentType: 'All',
    minimumSalary: '',
    notifyEmail: true,
    notifyInApp: true
  })

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Fetch student job alerts from MongoDB
  const fetchAlerts = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await getJobAlerts()
      if (res && res.alerts) {
        setAlerts(res.alerts)
      } else {
        setAlerts([])
      }
    } catch (err) {
      if (err?.name === 'AbortError' || err?.message?.includes('aborted')) return
      showToast('Could not load job alerts. Please try again.')
      setAlerts([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const handleOpenCreateModal = () => {
    setEditingAlert(null)
    setFormData({
      name: '',
      keywords: '',
      category: 'All',
      company: '',
      location: '',
      workMode: 'All',
      employmentType: 'All',
      minimumSalary: '',
      notifyEmail: true,
      notifyInApp: true
    })
    setShowModal(true)
  }

  const handleOpenEditModal = (alert) => {
    setEditingAlert(alert)
    setFormData({
      name: alert.name || '',
      keywords: (alert.keywords || []).join(', '),
      category: alert.categories?.[0] || 'All',
      company: (alert.companies || []).join(', '),
      location: (alert.locations || []).join(', '),
      workMode: alert.workModes?.[0] || 'All',
      employmentType: alert.employmentTypes?.[0] || 'All',
      minimumSalary: alert.minimumSalary || '',
      notifyEmail: alert.notifyEmail !== undefined ? alert.notifyEmail : true,
      notifyInApp: alert.notifyInApp !== undefined ? alert.notifyInApp : true
    })
    setShowModal(true)
  }

  const handleSaveAlert = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      showToast('Please enter an alert title')
      return
    }

    const payload = {
      name: formData.name.trim(),
      keywords: formData.keywords ? formData.keywords.split(',').map(s => s.trim()).filter(Boolean) : [],
      categories: formData.category !== 'All' ? [formData.category] : [],
      companies: formData.company ? formData.company.split(',').map(s => s.trim()).filter(Boolean) : [],
      locations: formData.location ? formData.location.split(',').map(s => s.trim()).filter(Boolean) : [],
      workModes: formData.workMode !== 'All' ? [formData.workMode] : [],
      employmentTypes: formData.employmentType !== 'All' ? [formData.employmentType] : [],
      minimumSalary: formData.minimumSalary ? Number(formData.minimumSalary) : undefined,
      notifyEmail: formData.notifyEmail,
      notifyInApp: formData.notifyInApp
    }

    try {
      if (editingAlert) {
        const res = await updateJobAlert(editingAlert._id || editingAlert.id, payload)
        if (res && res.alert) {
          setAlerts(prev => prev.map(a => (a._id || a.id) === (editingAlert._id || editingAlert.id) ? res.alert : a))
          showToast('Job alert updated successfully!')
        }
      } else {
        const res = await createJobAlert(payload)
        if (res && res.alert) {
          setAlerts(prev => [res.alert, ...prev])
          showToast('Job alert created successfully!')
        }
      }
      setShowModal(false)
    } catch (err) {
      console.error('Failed to save alert:', err)
      showToast('Failed to save alert. Please try again.')
    }
  }

  const handleDeleteAlert = async (id) => {
    setAlerts(prev => prev.filter(a => (a._id || a.id) !== id))
    showToast('Job alert removed')

    try {
      await deleteJobAlert(id)
    } catch (err) {
      console.error('Failed to delete alert:', err)
      showToast('Failed to remove alert. Please try again.')
      fetchAlerts()
    }
  }

  const handleToggle = async (id) => {
    try {
      const res = await toggleJobAlert(id)
      if (res && res.alert) {
        setAlerts(prev => prev.map(a => (a._id || a.id) === id ? res.alert : a))
        showToast(`Alert notifications ${res.alert.active ? 'enabled' : 'paused'}`)
      }
    } catch (err) {
      console.error('Toggle alert error:', err)
    }
  }

  return (
    <AppLayout>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 24,
              right: 24,
              zIndex: 9999,
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: 14,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              fontSize: 13.5,
              fontWeight: 700,
              fontFamily: 'Sora, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <Sparkles size={16} style={{ color: '#FDE047' }} />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Sub Navigation Header with Back Button & 6-Pill Bar */}
      <JobsSubNavHeader
        activeTab="alerts"
        title={`Smart Job Alerts (${alerts.length})`}
        subtitle="Set your target preferences and receive instant notifications whenever new matching jobs are posted."
        badge="JOB MATCH ENGINE"
        actions={
          <button
            onClick={handleOpenCreateModal}
            style={{
              height: 40,
              padding: '0 20px',
              borderRadius: 12,
              background: '#FFFFFF',
              color: '#7C3AED',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 800,
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Create Alert</span>
          </button>
        }
      />

      <div className="container" style={{ margin: '24px auto 60px', padding: '0 24px' }}>
        
        {/* EMPTY STATE */}
        {!loading && alerts.length === 0 && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: 24,
            padding: '56px 24px',
            textAlign: 'center',
            border: '1px border-dashed #CBD5E1',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14
          }}>
            <div style={{
              width: 68,
              height: 68,
              borderRadius: 22,
              background: '#F5F3FF',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              border: '1px solid #DDD6FE'
            }}>
              🔔
            </div>

            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              No Job Alerts Configured
            </h3>

            <p style={{ fontSize: 14, color: '#64748B', maxWidth: 440, lineHeight: 1.55, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
              Create custom alert triggers to get instant email and in-app notifications when new jobs match your skills.
            </p>

            <button
              onClick={handleOpenCreateModal}
              style={{
                marginTop: 6,
                height: 42,
                padding: '0 24px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 800,
                fontSize: 13.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
              }}
            >
              <Plus size={16} />
              <span>Create Your First Alert</span>
            </button>
          </div>
        )}

        {/* ALERTS GRID */}
        {!loading && alerts.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 20
          }}>
            {alerts.map(alert => {
              const alertId = alert._id || alert.id
              const formattedDate = new Date(alert.updatedAt || alert.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })

              return (
                <motion.div
                  key={alertId}
                  whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 20,
                    padding: 22,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 16
                  }}
                >
                  {/* Top Row: Name & Status Toggle */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{
                        fontFamily: 'Sora, sans-serif',
                        fontSize: 16.5,
                        fontWeight: 800,
                        color: '#0F172A',
                        margin: '0 0 4px'
                      }}>
                        {alert.name}
                      </h3>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 9px',
                        borderRadius: 10,
                        background: alert.isActive ? '#F0FDF4' : '#F1F5F9',
                        color: alert.isActive ? '#15803D' : '#64748B',
                        border: alert.isActive ? '1px solid #BBF7D0' : '1px solid #CBD5E1',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        {alert.isActive ? <CheckCircle2 size={12} /> : <BellOff size={12} />}
                        {alert.isActive ? 'Active' : 'Paused'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggle(alertId)}
                      style={{
                        height: 32,
                        padding: '0 12px',
                        borderRadius: 8,
                        background: alert.isActive ? '#FFFBEB' : '#EFF6FF',
                        color: alert.isActive ? '#D97706' : '#2563EB',
                        border: alert.isActive ? '1px solid #FDE68A' : '1px solid #BFDBFE',
                        cursor: 'pointer',
                        fontSize: 11.5,
                        fontWeight: 700,
                        fontFamily: 'Sora, sans-serif'
                      }}
                    >
                      {alert.isActive ? 'Pause' : 'Activate'}
                    </button>
                  </div>

                  {/* Matching Criteria Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(alert.keywords || []).map((kw, i) => (
                      <span key={i} style={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        padding: '3px 9px',
                        borderRadius: 8,
                        background: '#F5F3FF',
                        color: '#7C3AED',
                        border: '1px solid #DDD6FE'
                      }}>
                        #{kw}
                      </span>
                    ))}

                    {(alert.locations || []).map((loc, i) => (
                      <span key={i} style={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        padding: '3px 9px',
                        borderRadius: 8,
                        background: '#EFF6FF',
                        color: '#2563EB',
                        border: '1px solid #BFDBFE'
                      }}>
                        📍 {loc}
                      </span>
                    ))}

                    {alert.minimumSalary > 0 && (
                      <span style={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        padding: '3px 9px',
                        borderRadius: 8,
                        background: '#F0FDF4',
                        color: '#15803D',
                        border: '1px solid #BBF7D0'
                      }}>
                        💵 Min ${alert.minimumSalary.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Notification Channels & Last Checked */}
                  <div style={{
                    background: '#F8FAFC',
                    borderRadius: 12,
                    padding: '10px 14px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 11.5,
                    color: '#475569',
                    fontWeight: 600
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {alert.notifyEmail && <span title="Email Alerts Enabled">✉️ Email</span>}
                      {alert.notifyInApp && <span title="In-App Alerts Enabled">🔔 In-App</span>}
                    </span>
                    <span style={{ color: '#94A3B8' }}>
                      Updated {formattedDate}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleOpenEditModal(alert)}
                      style={{
                        flex: 1,
                        height: 38,
                        borderRadius: 10,
                        background: '#F1F5F9',
                        color: '#334155',
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
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(alertId)}
                      style={{
                        height: 38,
                        padding: '0 14px',
                        borderRadius: 10,
                        background: '#FFF1F2',
                        color: '#DC2626',
                        border: '1px solid #FECDD3',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* CREATE / EDIT ALERT MODAL */}
      <AnimatePresence>
        {showModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                background: '#FFFFFF',
                borderRadius: 24,
                width: '100%',
                maxWidth: 580,
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: 32,
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#F1F5F9',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>

              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '0 0 20px' }}>
                {editingAlert ? 'Edit Job Alert' : 'Create New Job Alert'}
              </h2>

              <form onSubmit={handleSaveAlert} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                    Alert Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack Software Engineer"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      height: 40,
                      padding: '0 14px',
                      borderRadius: 10,
                      border: '1px solid #CBD5E1',
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                    Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, Python, Full Stack"
                    value={formData.keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                    style={{
                      width: '100%',
                      height: 40,
                      padding: '0 14px',
                      borderRadius: 10,
                      border: '1px solid #CBD5E1',
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                      Target Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Remote, Bangalore"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      style={{
                        width: '100%',
                        height: 40,
                        padding: '0 14px',
                        borderRadius: 10,
                        border: '1px solid #CBD5E1',
                        fontSize: 13,
                        outline: 'none',
                        fontFamily: 'DM Sans, sans-serif'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                      Minimum Salary ($ / yr)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 80000"
                      value={formData.minimumSalary}
                      onChange={(e) => setFormData(prev => ({ ...prev, minimumSalary: e.target.value }))}
                      style={{
                        width: '100%',
                        height: 40,
                        padding: '0 14px',
                        borderRadius: 10,
                        border: '1px solid #CBD5E1',
                        fontSize: 13,
                        outline: 'none',
                        fontFamily: 'DM Sans, sans-serif'
                      }}
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div style={{
                  background: '#F8FAFC',
                  borderRadius: 12,
                  padding: 16,
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  marginTop: 4
                }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: '#0F172A' }}>
                    Notification Channels
                  </span>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={formData.notifyEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, notifyEmail: e.target.checked }))}
                    />
                    <span>✉️ Send Email Notifications (Resend API)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={formData.notifyInApp}
                      onChange={(e) => setFormData(prev => ({ ...prev, notifyInApp: e.target.checked }))}
                    />
                    <span>🔔 Send In-App Notifications</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1,
                      height: 42,
                      borderRadius: 10,
                      background: '#F1F5F9',
                      color: '#475569',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'Sora, sans-serif',
                      fontWeight: 700,
                      fontSize: 13
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      height: 42,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'Sora, sans-serif',
                      fontWeight: 800,
                      fontSize: 13,
                      boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
                    }}
                  >
                    {editingAlert ? 'Update Alert' : 'Create Alert'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  )
}
