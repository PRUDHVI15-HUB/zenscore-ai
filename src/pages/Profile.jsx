import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'

const branches = ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'IT', 'Chemical', 'Other']
const universities = ['JNTUK', 'JNTUH', 'JNTUA', 'Anna University', 'VTU', 'Osmania', 'Other']
const semesters = ['1', '2', '3', '4', '5', '6', '7', '8']

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    branch: localStorage.getItem('zs_branch') || 'ECE',
    university: localStorage.getItem('zs_university') || 'JNTUK',
    semester: localStorage.getItem('zs_semester') || '3',
    bio: localStorage.getItem('zs_bio') || '',
  })

  const save = async () => {
    setSaving(true)
    localStorage.setItem('zs_branch', profile.branch)
    localStorage.setItem('zs_university', profile.university)
    localStorage.setItem('zs_semester', profile.semester)
    localStorage.setItem('zs_bio', profile.bio)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const inp = { width: '100%', height: 44, padding: '0 14px', borderRadius: 12, border: '1.5px solid #E8ECF4', background: '#F8FAFF', color: '#0F172A', fontSize: 14, fontFamily: 'DM Sans,sans-serif', outline: 'none', boxSizing: 'border-box' }

  return (
    <AppLayout>
      <div style={{ minHeight: 'calc(100vh - 64px)', background: '#F8FAFF', padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: 800 }}>

          {/* Header banner */}
          <div style={{ background: 'linear-gradient(135deg,#1E40AF,#2563EB,#7C3AED)', borderRadius: 24, padding: '32px 36px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.photoURL
                ? <img src={user.photoURL} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 32, color: '#fff' }}>{user?.displayName?.[0]}</span>}
            </div>
            <div>
              <h1 style={{ fontFamily: 'Sora,sans-serif', fontSize: 24, fontWeight: 800, color: '#fff' }}>{user?.displayName}</h1>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{user?.email}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                {profile.branch} • {profile.university} • Sem {profile.semester}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {[['profile', '👤 Profile'], ['account', '🔐 Account']].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{ height: 40, padding: '0 20px', borderRadius: 12, border: `1.5px solid ${activeTab === id ? '#7C3AED' : '#E8ECF4'}`, background: activeTab === id ? '#F3F0FF' : '#fff', color: activeTab === id ? '#7C3AED' : '#94A3B8', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 13 }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #E8ECF4' }}>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Personal Information</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[['Full Name', 'name', false], ['Email', 'email', true]].map(([label, key, disabled]) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</label>
                      <input value={profile[key]} disabled={disabled} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} style={{ ...inp, opacity: disabled ? 0.6 : 1 }} />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  {[['Branch', 'branch', branches], ['University', 'university', universities], ['Semester', 'semester', semesters]].map(([label, key, opts]) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</label>
                      <select value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                        {opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Bio</label>
                  <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Tell something about yourself..." rows={3} style={{ ...inp, height: 'auto', padding: '12px 14px', resize: 'vertical' }} />
                </div>

                {saved && (
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D', fontSize: 13.5, fontWeight: 600 }}>
                    ✅ Profile saved successfully!
                  </div>
                )}

                <button onClick={save} disabled={saving} style={{ height: 46, borderRadius: 12, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15, opacity: saving ? 0.8 : 1 }}>
                  {saving ? '💾 Saving...' : '💾 Save Profile'}
                </button>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Account Settings</div>

                <div style={{ padding: 20, borderRadius: 14, border: '1px solid #E8ECF4', background: '#F8FAFF' }}>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, color: '#0F172A', marginBottom: 4 }}>🔗 Connected Account</div>
                  <div style={{ fontSize: 13, color: '#94A3B8' }}>Signed in with Google • {user?.email}</div>
                </div>

                <div style={{ padding: 20, borderRadius: 14, border: '1px solid #FECACA', background: '#FEF2F2' }}>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, color: '#DC2626', marginBottom: 6 }}>⚠️ Danger Zone</div>
                  <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>Logging out will clear your session. Your data will be saved.</div>
                  <button onClick={() => { logout(); navigate('/') }} style={{ height: 42, padding: '0 24px', borderRadius: 12, background: '#DC2626', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14 }}>
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}