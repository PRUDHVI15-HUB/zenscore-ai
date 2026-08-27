import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, CheckCircle2, GraduationCap, Building2, IdCard } from 'lucide-react'

/**
 * ProfileHero Component
 * Clean, modern student identity card with avatar, edit picture button,
 * and key student details (Name, ID, College, Branch, Year).
 */
export default function ProfileHero({
  student = {
    name: 'Student',
    studentId: 'ZS-2026',
    branch: 'Not specified',
    year: 'Pending',
    college: 'Not specified',
    photoUrl: null
  },
  onUploadPhoto
}) {
  const fileInputRef = useRef(null)

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WEBP).')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Selected image exceeds 10MB limit. Please choose a smaller image.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result
      if (!rawDataUrl) return

      // Client-side canvas normalization (max 400x400 square crop/compress for fast live rendering)
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxDim = 400
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88)

        if (onUploadPhoto) {
          onUploadPhoto(optimizedDataUrl)
        }
      }
      img.onerror = () => {
        if (onUploadPhoto) {
          onUploadPhoto(rawDataUrl)
        }
      }
      img.src = rawDataUrl
    }
    reader.readAsDataURL(file)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
      style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4F46E5 100%)',
        borderRadius: 22,
        padding: '28px 32px',
        boxShadow: '0 12px 36px rgba(30, 27, 75, 0.18)',
        position: 'relative',
        overflow: 'hidden',
        color: '#FFFFFF'
      }}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        style={{ display: 'none' }}
      />

      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          right: '5%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(49, 46, 129, 0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
        
        {/* Student Avatar & Core Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
          
          {/* Avatar Container */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
                padding: 3,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#1E1B4B',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 30,
                  fontWeight: 800
                }}
              >
                {student.photoUrl ? (
                  <img src={student.photoUrl} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{student.name ? student.name.split(' ').map(n => n[0]).join('') : 'ST'}</span>
                )}
              </div>
            </div>

            {/* Upload Button overlay */}
            <button
              onClick={handleButtonClick}
              title="Upload / Change Profile Picture from device"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#4F46E5',
                border: '2.5px solid #FFFFFF',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Camera size={15} />
            </button>
          </div>


          {/* Student Identity Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  padding: '3px 10px',
                  borderRadius: 20,
                  color: '#E0E7FF',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                Student Profile
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#A7F3D0', fontWeight: 700 }}>
                <CheckCircle2 size={13} /> Active
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: 'clamp(22px, 2.5vw, 28px)',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.5px',
                margin: 0
              }}
            >
              {student.name}
            </h1>

            <div style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ color: '#FDE047', fontFamily: 'monospace', fontWeight: 700 }}>{student.studentId}</span>
              <span style={{ opacity: 0.5 }}>•</span>
              <span>{student.branch}</span>
            </div>

            <div style={{ fontSize: 12.5, color: 'rgba(255, 255, 255, 0.75)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span>🎓 {student.college}</span>
              <span style={{ opacity: 0.5 }}>•</span>
              <span>{student.year}</span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
