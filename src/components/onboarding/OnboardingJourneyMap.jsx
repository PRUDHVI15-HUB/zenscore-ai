import React, { useState, useEffect } from 'react'

export default function OnboardingJourneyMap({ onFinish }) {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 900 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{
      width: '100%',
      maxWidth: 1260,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
      padding: '0 8px 10px 8px',
      userSelect: 'none'
    }}>
      {/* ── Main 2-Column Showcase Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '0.85fr 1.65fr',
        alignItems: 'center',
        gap: isMobile ? '24px' : 'clamp(20px, 3vw, 40px)',
        width: '100%'
      }}>
        {/* ── Left Column: Headline & Hero Graphic ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(34px, 3.8vw, 44px)',
              fontWeight: 800,
              color: '#0F172A',
              fontFamily: 'Sora, sans-serif',
              letterSpacing: '-0.8px',
              lineHeight: 1.15,
              margin: 0
            }}>
              Your Journey <br />
              Starts <span style={{ color: '#4F46E5' }}>Here</span>
            </h1>

            <p style={{
              fontSize: 'clamp(14px, 1.4vw, 15px)',
              color: '#475569',
              lineHeight: 1.5,
              marginTop: 10,
              marginBottom: 0,
              maxWidth: 340
            }}>
              Everything you need to move from student to career-ready in one personalized ecosystem.
            </p>
          </div>

          {/* Framed Graphic Box */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 360,
            height: 200,
            background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
            border: '1.5px solid #E2E8F0',
            borderRadius: 20,
            boxShadow: '0 10px 30px rgba(79, 70, 229, 0.05)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {/* Top-Right Floating Graduation Cap Card */}
            <div style={{
              position: 'absolute',
              top: 14,
              right: 16,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: '7px 12px',
              boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              zIndex: 2
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#EFF6FF',
                color: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ width: 38, height: 4.5, background: '#CBD5E1', borderRadius: 2 }} />
                <div style={{ width: 24, height: 3.5, background: '#E2E8F0', borderRadius: 2 }} />
              </div>
            </div>

            {/* Left Foliage */}
            <svg width="55" height="120" viewBox="0 0 55 120" style={{ position: 'absolute', left: 12, bottom: 10 }}>
              <path d="M 28 120 Q 14 50 18 20 Q 32 60 28 120 Z" fill="#CBD5E1" opacity="0.6" />
              <path d="M 28 120 Q 4 65 9 40 Q 24 75 28 120 Z" fill="#94A3B8" opacity="0.4" />
              <path d="M 28 120 Q 46 65 42 40 Q 35 75 28 120 Z" fill="#94A3B8" opacity="0.4" />
            </svg>

            {/* Sitting Student */}
            <svg width="220" height="155" viewBox="0 0 220 155" fill="none" style={{ zIndex: 1, marginBottom: 2 }}>
              <ellipse cx="110" cy="150" rx="90" ry="4.5" fill="#E2E8F0" />
              <path d="M 65 126 C 50 126, 48 150, 80 150 L 140 150 C 172 150, 170 126, 155 126 Z" fill="#0F172A" />
              <ellipse cx="75" cy="142" rx="26" ry="10" fill="#1E293B" transform="rotate(-10 75 142)" />
              <ellipse cx="145" cy="142" rx="26" ry="10" fill="#1E293B" transform="rotate(10 145 142)" />
              <ellipse cx="50" cy="146" rx="9" ry="4.5" fill="#F87171" />
              <ellipse cx="170" cy="146" rx="9" ry="4.5" fill="#F87171" />
              <path d="M 85 88 C 80 64, 140 64, 135 88 L 145 132 L 75 132 Z" fill="#4F46E5" />
              <rect x="106" y="56" width="8" height="12" rx="2" fill="#FED7AA" />
              <circle cx="110" cy="44" r="14" fill="#FED7AA" />
              <path d="M 96 42 C 92 22, 128 22, 124 42 C 128 50, 130 70, 124 78 C 118 64, 118 38, 110 38 C 102 38, 102 64, 96 78 C 90 70, 92 50, 96 42 Z" fill="#0F172A" />
              <path d="M 85 88 Q 95 112 118 116" stroke="#4F46E5" strokeWidth="10" strokeLinecap="round" />
              <path d="M 135 88 Q 125 112 116 116" stroke="#4F46E5" strokeWidth="10" strokeLinecap="round" />
              <circle cx="120" cy="118" r="4.5" fill="#FED7AA" />
              <circle cx="113" cy="118" r="4.5" fill="#FED7AA" />
              <path d="M 98 118 L 142 118 L 147 128 L 93 128 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
              <path d="M 122 82 L 148 82 L 145 118 L 119 118 Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
              <circle cx="134" cy="100" r="2.4" fill="#4F46E5" />
            </svg>
          </div>
        </div>

        {/* ── Right Column: Master SVG Connected Infographic ── */}
        <div style={{
          width: '100%',
          maxWidth: 720,
          position: 'relative'
        }}>
          <svg
            viewBox="0 0 740 370"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              overflow: 'visible'
            }}
          >
            <defs>
              {/* Soft Drop Shadow Filter for White Cards and Circles */}
              <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.06" />
              </filter>
              <filter id="nodeShadow" x="-15%" y="-15%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#4F46E5" floodOpacity="0.1" />
              </filter>
            </defs>

            {/* ══════════════════════ 1. CONNECTING PATHS ══════════════════════ */}
            {/* Top-Left Line: from Student Resume Card (x=230, y=55) -> left to x=95 -> down to Academics (x=95, y=116) */}
            <path
              d="M 220 52 L 105 52 Q 95 52 95 62 L 95 116"
              stroke="#CBD5E1"
              strokeWidth="2"
              fill="none"
            />

            {/* Top-Right Line: from 95% Card (x=380, y=52) -> left to x=325 -> down to Skills (x=325, y=116) */}
            <path
              d="M 390 52 L 335 52 Q 325 52 325 62 L 325 116"
              stroke="#CBD5E1"
              strokeWidth="2"
              fill="none"
            />

            {/* Row 1 Horizontal Arrows */}
            {/* Academics -> Career */}
            <line x1="130" y1="150" x2="175" y2="150" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
            <path d="M 170 145 L 176 150 L 170 155" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Career -> Skills */}
            <line x1="245" y1="150" x2="290" y2="150" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
            <path d="M 285 145 L 291 150 L 285 155" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Skills -> Courses */}
            <line x1="360" y1="150" x2="405" y2="150" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
            <path d="M 400 145 L 406 150 L 400 155" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Courses to Right Branch & Loop back down to AI Tutor */}
            <path
              d="M 475 150 L 530 150"
              stroke="#CBD5E1"
              strokeWidth="2"
              fill="none"
            />
            {/* Loop down and left into AI Tutor */}
            <path
              d="M 515 150 Q 525 150 525 160 L 525 258 Q 525 268 515 268 L 476 268"
              stroke="#CBD5E1"
              strokeWidth="2"
              fill="none"
            />
            <path d="M 482 263 L 476 268 L 482 273" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Row 2: 110 Card to Jobs */}
            <line x1="130" y1="268" x2="175" y2="268" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

            {/* Jobs -> Productivity */}
            <line x1="245" y1="268" x2="290" y2="268" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
            <path d="M 285 263 L 291 268 L 285 273" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Productivity -> AI Tutor */}
            <line x1="360" y1="268" x2="405" y2="268" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
            <path d="M 400 263 L 406 268 L 400 273" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Productivity down to Bottom Feature Tree */}
            <path
              d="M 325 302 L 325 330 Q 325 340 335 340 L 350 340"
              stroke="#CBD5E1"
              strokeWidth="2"
              fill="none"
            />

            {/* ══════════════════════ 2. TOP FLOATING CARDS ══════════════════════ */}
            {/* Card 1: Student Resume / Portfolio Card */}
            <g transform="translate(200, 18)" filter="url(#softShadow)">
              <rect width="130" height="66" rx="14" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="1.5" />
              {/* Illustrated Standing Student */}
              <circle cx="28" cy="18" r="7" fill="#FED7AA" />
              <path d="M 22 17 C 20 10, 34 10, 34 17 Z" fill="#0F172A" />
              <path d="M 20 26 L 36 26 L 38 46 L 18 46 Z" fill="#4F46E5" />
              <rect x="14" y="34" width="11" height="15" rx="2" fill="#0F172A" />
              <path d="M 22 46 L 22 60 M 34 46 L 34 60" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
              <path d="M 36 28 L 44 34" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />

              {/* Resume Document with Profile Badge */}
              <rect x="52" y="14" width="66" height="40" rx="4" fill="#F8FAFC" stroke="#E2E8F0" />
              <rect x="58" y="20" width="34" height="4.5" rx="2" fill="#CBD5E1" />
              <rect x="100" y="18" width="12" height="12" rx="3" fill="#4F46E5" />
              <circle cx="106" cy="23" r="2.5" fill="#FFFFFF" />
              <path d="M 103 28 C 103 26, 109 26, 109 28 Z" fill="#FFFFFF" />
              <rect x="58" y="28" width="54" height="3.5" rx="1.5" fill="#E2E8F0" />
              <rect x="58" y="34" width="42" height="3.5" rx="1.5" fill="#CBD5E1" />
              <rect x="58" y="40" width="48" height="3.5" rx="1.5" fill="#E2E8F0" />
            </g>

            {/* Card 2: 95% Student Paths Dashboard Card */}
            <g transform="translate(385, 14)" filter="url(#softShadow)">
              <rect width="180" height="74" rx="14" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="1.5" />
              {/* Task rows */}
              <circle cx="20" cy="22" r="5.5" fill="#4F46E5" />
              <path d="M 17.5 22 L 19.5 24 L 23 20" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="30" y="19.5" width="42" height="5" rx="2.5" fill="#E2E8F0" />

              <circle cx="20" cy="37" r="5.5" fill="#4F46E5" />
              <path d="M 17.5 37 L 19.5 39 L 23 35" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="30" y="34.5" width="48" height="5" rx="2.5" fill="#E2E8F0" />
              <circle cx="84" cy="37" r="4.5" fill="#CBD5E1" />

              <circle cx="20" cy="52" r="5.5" fill="#4F46E5" />
              <path d="M 17.5 52 L 19.5 54 L 23 50" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="30" y="49.5" width="36" height="5" rx="2.5" fill="#E2E8F0" />

              {/* 95% Column */}
              <line x1="98" y1="14" x2="98" y2="60" stroke="#F1F5F9" strokeWidth="1" />
              <text x="122" y="32" fontSize="16" fontWeight="900" fontFamily="Sora, sans-serif" fill="#0F172A" textAnchor="middle">95%</text>
              <text x="122" y="44" fontSize="8.5" fontWeight="600" fontFamily="DM Sans, sans-serif" fill="#64748B" textAnchor="middle">student</text>
              {/* 4 Avatars */}
              <circle cx="107" cy="55" r="6" fill="#F87171" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="117" cy="55" r="6" fill="#60A5FA" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="127" cy="55" r="6" fill="#34D399" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="137" cy="55" r="6" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="1" />

              {/* Paths Badge */}
              <rect x="146" y="20" width="28" height="15" rx="7.5" fill="#DCFCE7" />
              <text x="160" y="30" fontSize="7.5" fontWeight="800" fill="#15803D" textAnchor="middle">▲ paths</text>
              <text x="160" y="52" fontSize="11" textAnchor="middle">♟</text>
            </g>

            {/* ══════════════════════ 3. ROW 1 CIRCULAR NODES ══════════════════════ */}
            {/* Node 1: Academics (x=95, y=150) */}
            <g transform="translate(95, 150)">
              <circle cx="0" cy="0" r="35" fill="#FFFFFF" stroke="#E0E7FF" strokeWidth="2" filter="url(#nodeShadow)" />
              {/* Doc Icon */}
              <path d="M -8 -12 L 2 -12 L 8 -6 L 8 12 C 8 13.1 7.1 14 6 14 L -8 14 C -9.1 14 -10 13.1 -10 12 L -10 -10 C -10 -11.1 -9.1 -12 -8 -12 Z" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
              <path d="M 2 -12 L 2 -5 L 8 -5" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
              <line x1="-5" y1="1" x2="4" y2="1" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="-5" y1="6" x2="1" y2="6" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" />
              <text x="0" y="54" fontSize="14" fontWeight="800" fontFamily="Sora, sans-serif" fill="#0F172A" textAnchor="middle">Academics</text>
            </g>

            {/* Node 2: Career (x=210, y=150) */}
            <g transform="translate(210, 150)">
              <circle cx="0" cy="0" r="35" fill="#FFFFFF" stroke="#E0E7FF" strokeWidth="2" filter="url(#nodeShadow)" />
              {/* Bullseye Icon */}
              <circle cx="0" cy="0" r="13" stroke="#4F46E5" strokeWidth="2.5" fill="none" />
              <circle cx="0" cy="0" r="7.5" stroke="#4F46E5" strokeWidth="2.2" fill="none" />
              <circle cx="0" cy="0" r="2.8" fill="#4F46E5" />
              <text x="0" y="54" fontSize="14" fontWeight="800" fontFamily="Sora, sans-serif" fill="#0F172A" textAnchor="middle">Career</text>
            </g>

            {/* Node 3: Skills (x=325, y=150) */}
            <g transform="translate(325, 150)">
              <circle cx="0" cy="0" r="35" fill="#FFFFFF" stroke="#E0E7FF" strokeWidth="2" filter="url(#nodeShadow)" />
              {/* Grad Cap Icon */}
              <polygon points="0,-8 14,-1 0,6 -14,-1" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
              <path d="M -9 2.5 L -9 9 C -9 12 9 12 9 9 L 9 2.5" stroke="#4F46E5" strokeWidth="2.5" fill="none" />
              <line x1="14" y1="-1" x2="14" y2="10" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
              <text x="0" y="54" fontSize="14" fontWeight="800" fontFamily="Sora, sans-serif" fill="#0F172A" textAnchor="middle">Skills</text>
            </g>

            {/* Node 4: Courses (x=440, y=150) */}
            <g transform="translate(440, 150)">
              <circle cx="0" cy="0" r="35" fill="#FFFFFF" stroke="#E0E7FF" strokeWidth="2" filter="url(#nodeShadow)" />
              {/* Medal / Award Icon */}
              <circle cx="0" cy="-3" r="8.5" stroke="#4F46E5" strokeWidth="2.5" fill="none" />
              <path d="M -4.5 3 L -7 13 L 0 9.5 L 7 13 L 4.5 3" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
              <text x="0" y="54" fontSize="14" fontWeight="800" fontFamily="Sora, sans-serif" fill="#0F172A" textAnchor="middle">Courses</text>
            </g>

            {/* ══════════════════════ 4. RIGHT VERTICAL BRANCH CARDS ══════════════════════ */}
            {/* Card A: 5,000+ Search */}
            <g transform="translate(545, 95)" filter="url(#softShadow)">
              <rect width="130" height="64" rx="14" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="1.5" />
              <text x="14" y="24" fontSize="12" fontWeight="900" fontFamily="Sora, sans-serif" fill="#0F172A">5,000+</text>
              <rect x="14" y="30" width="38" height="4" rx="2" fill="#CBD5E1" />
              <rect x="14" y="36" width="26" height="4" rx="2" fill="#E2E8F0" />
              <rect x="14" y="44" width="38" height="12" rx="4" fill="#4F46E5" />
              <text x="33" y="53" fontSize="7.5" fontWeight="800" fill="#FFFFFF" textAnchor="middle">Search</text>

              {/* Female Instructor Figure */}
              <circle cx="95" cy="20" r="6" fill="#FED7AA" />
              <path d="M 88 18 C 86 12, 102 12, 100 18 Z" fill="#0F172A" />
              <path d="M 86 28 L 102 28 L 104 48 L 84 48 Z" fill="#3B82F6" />
              <path d="M 102 30 L 112 24" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Vertical Down Arrow from Card A to Card B */}
            <path d="M 610 166 L 610 176 M 607 173 L 610 176 L 613 173" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

            {/* Card B: Student with Laptop */}
            <g transform="translate(545, 184)" filter="url(#softShadow)">
              <rect width="130" height="64" rx="14" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="1.5" />
              <circle cx="34" cy="20" r="6" fill="#FED7AA" />
              <path d="M 28 18 C 26 12, 42 12, 40 18 Z" fill="#0F172A" />
              <path d="M 26 28 L 42 28 L 44 48 L 24 48 Z" fill="#4F46E5" />
              <rect x="30" y="32" width="14" height="9" rx="1.5" fill="#0F172A" />

              <rect x="62" y="24" width="46" height="4.5" rx="2" fill="#CBD5E1" />
              <rect x="62" y="32" width="32" height="4.5" rx="2" fill="#E2E8F0" />
            </g>

            {/* 💧 7 on datas text */}
            <text x="610" y="268" fontSize="10" fontWeight="800" fill="#4F46E5" textAnchor="middle">💧 7</text>
            <text x="610" y="280" fontSize="8.5" fontWeight="600" fill="#64748B" textAnchor="middle">on datas</text>

            {/* ══════════════════════ 5. ROW 2: 110 CARD + CIRCULAR NODES ══════════════════════ */}
            {/* 110 Randoms Card (Left of Jobs) */}
            <g transform="translate(30, 235)" filter="url(#softShadow)">
              <rect width="100" height="66" rx="14" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="1.5" />
              {/* Bot bubble */}
              <rect x="10" y="10" width="15" height="15" rx="4" fill="#EFF6FF" />
              <text x="17.5" y="21" fontSize="9" textAnchor="middle">🤖</text>
              {/* Center Student with Laptop */}
              <circle cx="50" cy="20" r="6" fill="#FED7AA" />
              <path d="M 44 18 C 42 12, 58 12, 56 18 Z" fill="#0F172A" />
              <path d="M 42 28 L 58 28 L 60 48 L 40 48 Z" fill="#3B82F6" />
              <rect x="46" y="33" width="15" height="9" rx="1.5" fill="#0F172A" />
              {/* Chart bubble */}
              <rect x="75" y="10" width="15" height="15" rx="4" fill="#ECFDF5" />
              <text x="82.5" y="21" fontSize="9" textAnchor="middle">📊</text>

              <text x="50" y="55" fontSize="11" fontWeight="900" fontFamily="Sora, sans-serif" fill="#0F172A" textAnchor="middle">✦ 110</text>
              <text x="50" y="63" fontSize="7.5" fontWeight="600" fill="#64748B" textAnchor="middle">randoms</text>
            </g>

            {/* Node 5: Jobs (x=210, y=268) */}
            <g transform="translate(210, 268)">
              <circle cx="0" cy="0" r="35" fill="#FFFFFF" stroke="#E0E7FF" strokeWidth="2" filter="url(#nodeShadow)" />
              {/* Suitcase Icon */}
              <rect x="-11" y="-6" width="22" height="16" rx="3" stroke="#4F46E5" strokeWidth="2.5" fill="none" />
              <path d="M -5 -6 L -5 -10 C -5 -11.1 -4.1 -12 -3 -12 L 3 -12 C 4.1 -12 5 -11.1 5 -10 L 5 -6" stroke="#4F46E5" strokeWidth="2.2" fill="none" />
              <line x1="-11" y1="0" x2="11" y2="0" stroke="#4F46E5" strokeWidth="2.2" />
              <rect x="-2.5" y="-2" width="5" height="4" rx="1" fill="#4F46E5" />
              <text x="0" y="54" fontSize="14" fontWeight="800" fontFamily="Sora, sans-serif" fill="#0F172A" textAnchor="middle">Jobs</text>
            </g>

            {/* Node 6: Productivity (x=325, y=268) */}
            <g transform="translate(325, 268)">
              <circle cx="0" cy="0" r="35" fill="#FFFFFF" stroke="#E0E7FF" strokeWidth="2" filter="url(#nodeShadow)" />
              {/* Bar Chart Icon */}
              <line x1="-10" y1="10" x2="10" y2="10" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="-6" y1="10" x2="-6" y2="2" stroke="#4F46E5" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="0" y1="10" x2="0" y2="-4" stroke="#4F46E5" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="6" y1="10" x2="6" y2="-10" stroke="#4F46E5" strokeWidth="2.8" strokeLinecap="round" />
              <text x="0" y="54" fontSize="14" fontWeight="800" fontFamily="Sora, sans-serif" fill="#0F172A" textAnchor="middle">Productivity</text>
            </g>

            {/* Node 7: AI Tutor (x=440, y=268) */}
            <g transform="translate(440, 268)">
              <circle cx="0" cy="0" r="35" fill="#FFFFFF" stroke="#E0E7FF" strokeWidth="2" filter="url(#nodeShadow)" />
              {/* Bot Icon */}
              <rect x="-10" y="-7" width="20" height="16" rx="4.5" stroke="#4F46E5" strokeWidth="2.5" fill="none" />
              <circle cx="-4.5" cy="0" r="2.2" fill="#4F46E5" />
              <circle cx="4.5" cy="0" r="2.2" fill="#4F46E5" />
              <line x1="0" y1="-12" x2="0" y2="-7" stroke="#4F46E5" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="0" cy="-12.5" r="1.5" fill="#4F46E5" />
              <line x1="-4" y1="5" x2="4" y2="5" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" />
              <text x="0" y="54" fontSize="14" fontWeight="800" fontFamily="Sora, sans-serif" fill="#0F172A" textAnchor="middle">AI Tutor</text>
            </g>

            {/* ══════════════════════ 6. BOTTOM FEATURE TREE CARD ══════════════════════ */}
            <g transform="translate(350, 318)" filter="url(#softShadow)">
              <rect width="115" height="46" rx="12" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="1.5" />
              {/* Center App Badge */}
              <rect x="42" y="10" width="16" height="16" rx="4" fill="#4F46E5" />
              <text x="50" y="21" fontSize="9" fill="#FFFFFF" textAnchor="middle">★</text>
              {/* Sub App Badges */}
              <rect x="14" y="6" width="13" height="13" rx="3" fill="#EFF6FF" />
              <text x="20.5" y="15" fontSize="7" textAnchor="middle">💼</text>

              <rect x="74" y="6" width="13" height="13" rx="3" fill="#F5F3FF" />
              <text x="80.5" y="15" fontSize="7" textAnchor="middle">🛡️</text>

              <rect x="14" y="27" width="13" height="13" rx="3" fill="#F8FAFC" />
              <text x="20.5" y="36" fontSize="7" textAnchor="middle">📊</text>

              <rect x="68" y="27" width="34" height="12" rx="3" fill="#F8FAFC" stroke="#E2E8F0" />
              <line x1="72" y1="31" x2="96" y2="31" stroke="#CBD5E1" strokeWidth="1.5" />
              <line x1="72" y1="35" x2="88" y2="35" stroke="#CBD5E1" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>

      {/* ── Bottom Section: Exact 3 Pill Cards + Center CTA ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginTop: 18,
        width: '100%'
      }}>
        {/* Left Trust Stat Card */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: 14,
          padding: '10px 18px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          minWidth: 120
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
            95% student
          </div>
          <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
            satisfaction
          </div>
        </div>

        {/* Center Primary Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <button
            onClick={onFinish}
            style={{
              background: '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 14,
              padding: '13px 48px',
              fontSize: 15,
              fontWeight: 800,
              fontFamily: 'Sora, sans-serif',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4338CA'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(79, 70, 229, 0.45)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#4F46E5'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 70, 229, 0.35)'
            }}
          >
            Enter ZenScore AI →
          </button>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#0F172A' }}>
            Let's build your career-ready future!
          </div>
        </div>

        {/* Right 2 Trust Stat Cards */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: 14,
            padding: '10px 18px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            minWidth: 120
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
              5,000+ career
            </div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
              paths mapped
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: 14,
            padding: '10px 18px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            minWidth: 100
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
              feature
            </div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
              highlights
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
