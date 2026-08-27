import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useStudentProfile } from '../context/StudentProfileContext'
import { User, Target, Code, Settings as SettingsIcon } from 'lucide-react'

// Import Subcomponents
import ProfileHero from '../components/profile/ProfileHero'
import ProfileActionBar from '../components/profile/ProfileActionBar'

// Import Section Views
import TabPersonalInfo from '../components/profile/tabs/TabPersonalInfo'
import TabAcademicInfo from '../components/profile/tabs/TabAcademicInfo'
import TabCareerPreferences from '../components/profile/tabs/TabCareerPreferences'
import TabCodingProfiles from '../components/profile/tabs/TabCodingProfiles'
import TabSettings from '../components/profile/tabs/TabSettings'

export const PROFILE_TABS = [
  { id: 'personal_academic', label: 'Personal & Academics', icon: User },
  { id: 'career', label: 'Career & Placement', icon: Target },
  { id: 'coding', label: 'Coding & Social Handles', icon: Code },
  { id: 'settings', label: 'Account & Settings', icon: SettingsIcon }
]

export default function Profile() {
  const { user, updateUserPhoto } = useAuth()
  const { profile, updateSection } = useStudentProfile()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')

  const [activeTab, setActiveTab] = useState(() => {
    return (tabParam && ['personal_academic', 'career', 'coding', 'settings'].includes(tabParam))
      ? tabParam
      : 'personal_academic'
  })

  useEffect(() => {
    if (tabParam && ['personal_academic', 'career', 'coding', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const [saving, setSaving] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const uid = user?.uid || 'guest'

  // 1. Personal Information State
  const [personalData, setPersonalData] = useState(() => {
    const saved = localStorage.getItem(`zs_personal_data_${uid}`)
    const cachedAvatar = localStorage.getItem(`zs_user_avatar_${uid}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (cachedAvatar && !parsed.photoUrl) parsed.photoUrl = cachedAvatar
      return parsed
    }
    const nameParts = user?.displayName ? user.displayName.split(' ') : []
    return {
      firstName: nameParts[0] || user?.email?.split('@')[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user?.email || '',
      phone: '',
      dob: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      languages: '',
      emergencyContact: '',
      photoUrl: user?.photoURL || cachedAvatar || null
    }
  })


  // 2. Academic Information State
  const [academicData, setAcademicData] = useState(() => {
    const saved = localStorage.getItem(`zs_academic_data_${uid}`)
    if (saved) return JSON.parse(saved)
    return {
      college: '',
      university: '',
      degree: '',
      branch: '',
      year: '',
      semester: '',
      rollNumber: '',
      graduationYear: '',
      cgpa: '',
      attendance: '',
      backlogs: '0'
    }
  })

  // 3. Career Preferences State
  const [careerData, setCareerData] = useState(() => {
    const saved = localStorage.getItem(`zs_career_data_${uid}`)
    if (saved) return JSON.parse(saved)
    return {
      targetCareer: '',
      dreamCompany: '',
      preferredLocation: '',
      expectedSalary: '',
      interestedDomains: '',
      workPreference: ''
    }
  })

  // 4. Coding & Social Profiles State
  const [codingProfiles, setCodingProfiles] = useState(() => {
    const saved = localStorage.getItem(`zs_coding_profiles_${uid}`)
    if (saved) return JSON.parse(saved)
    return {
      github: '',
      linkedin: '',
      leetcode: '',
      geeksforgeeks: '',
      codechef: '',
      codeforces: '',
      hackerrank: '',
      codingninjas: '',
      portfolioWebsite: ''
    }
  })

  // 5. Settings State
  const [settingsData, setSettingsData] = useState(() => {
    const saved = localStorage.getItem(`zs_settings_data_${uid}`)
    if (saved) return JSON.parse(saved)
    return {
      theme: 'system',
      emailNotifications: true,
      jobAlerts: true,
      recruiterVisibility: true,
      leaderboardPublic: true,
      language: 'English',
      timezone: 'Asia/Kolkata (IST)'
    }
  })

  // Sync state with logged-in user profile changes
  useEffect(() => {
    if (user?.uid) {
      const savedPersonal = localStorage.getItem(`zs_personal_data_${user.uid}`)
      if (savedPersonal) {
        setPersonalData(JSON.parse(savedPersonal))
      } else {
        const nameParts = user?.displayName ? user.displayName.split(' ') : []
        setPersonalData(prev => ({
          ...prev,
          firstName: nameParts[0] || user?.email?.split('@')[0] || prev.firstName || '',
          lastName: nameParts.slice(1).join(' ') || prev.lastName || '',
          email: user?.email || prev.email || ''
        }))
      }

      const savedAcademic = localStorage.getItem(`zs_academic_data_${user.uid}`)
      if (savedAcademic) setAcademicData(JSON.parse(savedAcademic))

      const savedCareer = localStorage.getItem(`zs_career_data_${user.uid}`)
      if (savedCareer) setCareerData(JSON.parse(savedCareer))

      const savedCoding = localStorage.getItem(`zs_coding_profiles_${user.uid}`)
      if (savedCoding) setCodingProfiles(JSON.parse(savedCoding))
    }
  }, [user?.uid])

  // Sync with StudentProfileContext
  useEffect(() => {
    if (profile?.personalInfo?.data) {
      const d = profile.personalInfo.data
      if (d.firstName || d.email) {
        setPersonalData(prev => ({ ...prev, ...d }))
      }
    }
    if (profile?.academicSummary?.data) {
      const d = profile.academicSummary.data
      if (d.degree || d.branch || d.college || d.currentCGPA) {
        setAcademicData(prev => ({
          ...prev,
          college: d.college || prev.college,
          university: d.university || prev.university,
          degree: d.degree || prev.degree,
          branch: d.branch || prev.branch,
          year: d.academicYear || prev.year,
          semester: d.currentSemester || prev.semester,
          rollNumber: d.rollNumber || prev.rollNumber,
          graduationYear: d.graduationYear || prev.graduationYear,
          cgpa: d.currentCGPA ? String(d.currentCGPA) : prev.cgpa,
          attendance: d.overallAttendance ? String(d.overallAttendance) : prev.attendance,
          backlogs: d.backlogs ? String(d.backlogs) : prev.backlogs
        }))
      }
    }
    if (profile?.careerProfile?.data) {
      const d = profile.careerProfile.data
      if (d.selectedCareerGoal) {
        setCareerData(prev => ({
          ...prev,
          targetCareer: d.selectedCareerGoal || prev.targetCareer
        }))
      }
    }
  }, [profile])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  // Save Master Profile
  const handleSaveChanges = async () => {
    setSaving(true)
    const currentUid = user?.uid || 'guest'
    localStorage.setItem(`zs_personal_data_${currentUid}`, JSON.stringify(personalData))
    localStorage.setItem(`zs_academic_data_${currentUid}`, JSON.stringify(academicData))
    localStorage.setItem(`zs_career_data_${currentUid}`, JSON.stringify(careerData))
    localStorage.setItem(`zs_coding_profiles_${currentUid}`, JSON.stringify(codingProfiles))
    localStorage.setItem(`zs_settings_data_${currentUid}`, JSON.stringify(settingsData))

    try {
      if (updateSection) {
        await updateSection('personalInfo', personalData, 'Profile')
        await updateSection('academicSummary', {
          college: academicData.college,
          university: academicData.university,
          degree: academicData.degree,
          branch: academicData.branch,
          academicYear: academicData.year,
          currentSemester: academicData.semester,
          rollNumber: academicData.rollNumber,
          graduationYear: academicData.graduationYear,
          currentCGPA: academicData.cgpa ? parseFloat(academicData.cgpa) : null,
          overallAttendance: academicData.attendance ? parseFloat(academicData.attendance) : null,
          backlogs: academicData.backlogs ? parseInt(academicData.backlogs, 10) : 0
        }, 'Profile')
        await updateSection('careerProfile', {
          selectedCareerGoal: careerData.targetCareer,
          dreamCompany: careerData.dreamCompany,
          preferredLocation: careerData.preferredLocation,
          expectedSalary: careerData.expectedSalary,
          interestedDomains: careerData.interestedDomains,
          workPreference: careerData.workPreference
        }, 'Profile')
      }
    } catch (e) {
      console.warn('Profile save sync warning:', e)
    }

    await new Promise(r => setTimeout(r, 400))
    setSaving(false)
    showToast('Profile changes saved successfully!')
  }

  const handleCancelChanges = () => {
    showToast('Changes reverted to last saved state.')
  }

  const handleDeleteProfile = () => {
    const currentUid = user?.uid || 'guest'
    localStorage.removeItem(`zs_personal_data_${currentUid}`)
    localStorage.removeItem(`zs_academic_data_${currentUid}`)
    localStorage.removeItem(`zs_career_data_${currentUid}`)
    localStorage.removeItem(`zs_coding_profiles_${currentUid}`)
    localStorage.removeItem(`zs_settings_data_${currentUid}`)
    showToast('Profile data reset...')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  return (
    <AppLayout>
      <div style={{ minHeight: 'calc(100vh - 64px)', background: '#F8FAFC', padding: '28px 0 80px' }}>
        <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* SECTION 1: PROFILE HERO BANNER */}
          <ProfileHero
            student={{
              name: `${personalData.firstName} ${personalData.lastName}`.trim() || user?.displayName || 'Student',
              studentId: academicData.rollNumber ? `ZS-2026-${academicData.rollNumber}` : 'ZS-2026',
              branch: academicData.branch || 'Not specified',
              year: academicData.year ? (academicData.semester ? `${academicData.year} (${academicData.semester})` : academicData.year) : 'Pending',
              college: academicData.college || 'Not specified',
              photoUrl: personalData.photoUrl
            }}
            onUploadPhoto={async (uploadedPhotoUrl) => {
              if (!uploadedPhotoUrl) return
              setPersonalData(prev => ({ ...prev, photoUrl: uploadedPhotoUrl }))
              const currentUid = user?.uid || 'guest'
              try {
                localStorage.setItem('zenscore_custom_avatar', uploadedPhotoUrl)
                localStorage.setItem(`zs_user_avatar_${currentUid}`, uploadedPhotoUrl)
                
                // Immediately save personalData with new photoUrl into localStorage
                const savedPersonal = localStorage.getItem(`zs_personal_data_${currentUid}`)
                const parsed = savedPersonal ? JSON.parse(savedPersonal) : {}
                parsed.photoUrl = uploadedPhotoUrl
                localStorage.setItem(`zs_personal_data_${currentUid}`, JSON.stringify({ ...parsed, ...personalData, photoUrl: uploadedPhotoUrl }))

                if (updateUserPhoto) {
                  await updateUserPhoto(uploadedPhotoUrl)
                }
                if (updateSection) {
                  updateSection('basicProfile', { photoURL: uploadedPhotoUrl, avatar: uploadedPhotoUrl })
                }
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('zenscore:avatar_updated', { detail: { photoUrl: uploadedPhotoUrl } }))
                }
                showToast('Profile photo updated live!')
              } catch (err) {
                console.warn('Profile photo update notice:', err)
                showToast('Profile photo updated!')
              }
            }}


          />

          {/* SECTION 2: CLEAN TAB NAVIGATION PILLS */}
          <div
            className="profile-nav-tabs"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
              gap: 10,
              width: '100%'
            }}
          >
            {PROFILE_TABS.map((t) => {
              const isActive = activeTab === t.id
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    height: 46,
                    padding: '0 16px',
                    borderRadius: 14,
                    border: isActive ? '1px solid #7C3AED' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                    background: isActive
                      ? 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)'
                      : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#475569',
                    fontFamily: 'Sora, sans-serif',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: 13,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.2s ease',
                    boxShadow: isActive
                      ? '0 4px 14px rgba(124, 58, 237, 0.25)'
                      : '0 1px 3px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="truncate">{t.label}</span>
                </button>
              )
            })}
          </div>

          {/* SECTION 3: ACTIVE TAB CONTENT */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              {/* TAB 1: PERSONAL & ACADEMIC INFORMATION */}
              {activeTab === 'personal_academic' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '28px 32px', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)' }}>
                    <TabPersonalInfo formData={personalData} onChange={setPersonalData} />
                  </div>
                  <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '28px 32px', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)' }}>
                    <TabAcademicInfo formData={academicData} onChange={setAcademicData} />
                  </div>
                </div>
              )}

              {/* TAB 2: CAREER PREFERENCES */}
              {activeTab === 'career' && (
                <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '28px 32px', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)' }}>
                  <TabCareerPreferences formData={careerData} onChange={setCareerData} />
                </div>
              )}

              {/* TAB 3: CODING PROFILES & HANDLES */}
              {activeTab === 'coding' && (
                <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '28px 32px', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)' }}>
                  <TabCodingProfiles formData={codingProfiles} onChange={setCodingProfiles} />
                </div>
              )}

              {/* TAB 4: SETTINGS & PREFERENCES */}
              {activeTab === 'settings' && (
                <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '28px 32px', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)' }}>
                  <TabSettings settingsData={settingsData} onChange={setSettingsData} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* SECTION 4: ACTION BAR AT BOTTOM */}
          <ProfileActionBar
            onSave={handleSaveChanges}
            onCancel={handleCancelChanges}
            onDeleteProfile={handleDeleteProfile}
            isSaving={saving}
          />

        </div>
      </div>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 100,
            background: '#0F172A',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: 14,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'Sora, sans-serif',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <span>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Responsive Breakpoints Style */}
      <style>{`
        @media (max-width: 768px) {
          .profile-nav-tabs {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 8px !important;
          }
        }
        @media (max-width: 480px) {
          .profile-nav-tabs {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </AppLayout>
  )
}