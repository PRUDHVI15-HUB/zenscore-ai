import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { getFeedbackStatus, submitFeedback } from '../services/api'
import {
  MessageSquareHeart,
  CheckCircle2,
  AlertCircle,
  Send,
  Building,
  GraduationCap,
  Sparkles,
  HelpCircle,
  ShieldCheck
} from 'lucide-react'

const SUS_QUESTIONS = [
  { id: 'q1', text: 'I think that I would like to use this system frequently.' },
  { id: 'q2', text: 'I found the system unnecessarily complex.' },
  { id: 'q3', text: 'I thought the system was easy to use.' },
  { id: 'q4', text: 'I think that I would need the support of a technical person to be able to use this system.' },
  { id: 'q5', text: 'I found the various functions in this system were well integrated.' },
  { id: 'q6', text: 'I thought there was too much inconsistency in this system.' },
  { id: 'q7', text: 'I would imagine that most people would learn to use this system very quickly.' },
  { id: 'q8', text: 'I found the system very cumbersome to use.' },
  { id: 'q9', text: 'I felt very confident using the system.' },
  { id: 'q10', text: 'I needed to learn a lot of things before I could get going with this system.' }
]

const LIKERT_QUESTIONS = [
  { id: 'dashboardClear', text: 'The dashboard is clear.' },
  { id: 'recommendationsUseful', text: 'The next-step recommendations are useful.' },
  { id: 'transcriptSavedTime', text: 'The transcript import saved me time.' },
  { id: 'careerReadinessUnderstandable', text: 'The career readiness score is understandable.' },
  { id: 'wouldKeepUsing', text: 'I would keep using it.' }
]

export default function Feedback() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [institution, setInstitution] = useState('')
  const [year, setYear] = useState('3')
  const [susResponses, setSusResponses] = useState({})
  const [likertResponses, setLikertResponses] = useState({})
  const [freeText, setFreeText] = useState('')

  useEffect(() => {
    loadFeedbackStatus()
  }, [])

  const loadFeedbackStatus = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getFeedbackStatus()
      if (res && res.success && res.data) {
        setStatus(res.data)
      }
    } catch (err) {
      setError(err.message || 'Error checking feedback status')
    } finally {
      setLoading(false)
    }
  }

  const handleSusChange = (qid, val) => {
    setSusResponses(prev => ({ ...prev, [qid]: Number(val) }))
  }

  const handleLikertChange = (id, val) => {
    setLikertResponses(prev => ({ ...prev, [id]: Number(val) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!institution.trim()) {
      setError('Please provide your university or institution name.')
      return
    }

    // Ensure all 10 SUS questions are answered
    for (let i = 1; i <= 10; i++) {
      if (!susResponses[`q${i}`]) {
        setError(`Please answer question ${i} of the System Usability Scale.`)
        return
      }
    }

    // Ensure all 5 Likert questions are answered
    for (const q of LIKERT_QUESTIONS) {
      if (!likertResponses[q.id]) {
        setError(`Please answer: "${q.text}"`)
        return
      }
    }

    setSubmitting(true)
    try {
      const payload = {
        institution: institution.trim(),
        year: Number(year),
        susResponses,
        likertResponses,
        freeText: freeText.trim()
      }

      const res = await submitFeedback(payload)
      if (res && res.success) {
        setSuccess(res.data)
        loadFeedbackStatus()
      } else {
        setError(res?.message || 'Failed to submit feedback.')
      }
    } catch (err) {
      setError(err.message || 'An error occurred while submitting feedback.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        
        {/* Header Banner */}
        <div style={{
          background: 'var(--bg-soft, #FFFFFF)',
          border: '1px solid var(--border, #E2E8F0)',
          borderRadius: 24,
          padding: 28,
          boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 20
        }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: 'rgba(99, 102, 241, 0.12)',
            color: '#6366F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <MessageSquareHeart size={28} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Conference User Study & Feedback
            </span>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
              Student Experience Survey
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted, #64748B)', margin: 0, lineHeight: 1.5 }}>
              Your feedback directly evaluates ZenScore AI's usability and system design. 
              Responses are collected for empirical research with strictly one submission allowed per student per study round.
            </p>
          </div>
        </div>

        {/* Research Study Consent Notice */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 16,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <ShieldCheck size={20} style={{ color: '#6366F1', flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-dark, #0F172A)', lineHeight: 1.5 }}>
            <strong>Consent Notice:</strong> Participation is voluntary. Responses are used only for a research paper, reported in aggregate, and no personal data will be published.
          </p>
        </div>

        {/* Existing Submission Banner */}
        {status?.hasSubmitted && (
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 20,
            padding: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}>
            <CheckCircle2 size={32} style={{ color: '#16A34A', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#166534', fontFamily: 'Sora, sans-serif' }}>
                Feedback Recorded for Round {status.round}
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#15803D' }}>
                Thank you! You have already submitted your study response for this evaluation round.
                Your recorded System Usability Scale (SUS) score is <strong>{status.submission?.susScore || 'N/A'}/100</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Form Container (only when not yet submitted) */}
        {!status?.hasSubmitted && !loading && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Student Academic Affiliation */}
            <div style={{ background: 'var(--bg-soft, #FFFFFF)', border: '1px solid var(--border, #E2E8F0)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text-dark, #0F172A)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building size={18} style={{ color: '#4F46E5' }} /> Academic Demographics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                    Institution / University Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JNTUH, CMRTC, Anna University"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 12,
                      border: '1px solid var(--border, #CBD5E1)',
                      fontSize: 13,
                      background: 'var(--bg, #FFFFFF)',
                      color: 'var(--text-dark, #0F172A)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                    Year of Study *
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 12,
                      border: '1px solid var(--border, #CBD5E1)',
                      fontSize: 13,
                      background: 'var(--bg, #FFFFFF)',
                      color: 'var(--text-dark, #0F172A)'
                    }}
                  >
                    <option value="1">1st Year (B.Tech)</option>
                    <option value="2">2nd Year (B.Tech)</option>
                    <option value="3">3rd Year (B.Tech)</option>
                    <option value="4">4th Year (B.Tech)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Part 1: 10 Standard SUS Questions */}
            <div style={{ background: 'var(--bg-soft, #FFFFFF)', border: '1px solid var(--border, #E2E8F0)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text-dark, #0F172A)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} style={{ color: '#7C3AED' }} /> System Usability Scale (SUS)
                </h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted, #64748B)' }}>
                  Standard 10-item instrument. Rate from 1 (Strongly Disagree) to 5 (Strongly Agree).
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {SUS_QUESTIONS.map((q, idx) => (
                  <div key={q.id} style={{ padding: '12px 14px', background: 'var(--bg, #F8FAFC)', borderRadius: 12, border: '1px solid var(--border, #F1F5F9)' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark, #1E293B)', marginBottom: 8 }}>
                      {idx + 1}. {q.text}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 420 }}>
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>Strongly Disagree</span>
                      {[1, 2, 3, 4, 5].map(v => (
                        <label key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer', fontSize: 11, color: '#475569' }}>
                          <input
                            type="radio"
                            name={q.id}
                            value={v}
                            checked={susResponses[q.id] === v}
                            onChange={() => handleSusChange(q.id, v)}
                            style={{ cursor: 'pointer' }}
                          />
                          {v}
                        </label>
                      ))}
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>Strongly Agree</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Part 2: 5 Specific Platform Likert Questions */}
            <div style={{ background: 'var(--bg-soft, #FFFFFF)', border: '1px solid var(--border, #E2E8F0)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text-dark, #0F172A)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={18} style={{ color: '#059669' }} /> Platform Evaluation Questions
                </h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted, #64748B)' }}>
                  Rate your direct experience with ZenScore AI's core capabilities (1–5 scale).
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {LIKERT_QUESTIONS.map((q, idx) => (
                  <div key={q.id} style={{ padding: '12px 14px', background: 'var(--bg, #F8FAFC)', borderRadius: 12, border: '1px solid var(--border, #F1F5F9)' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark, #1E293B)', marginBottom: 8 }}>
                      {idx + 1}. {q.text}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 420 }}>
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>Strongly Disagree</span>
                      {[1, 2, 3, 4, 5].map(v => (
                        <label key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer', fontSize: 11, color: '#475569' }}>
                          <input
                            type="radio"
                            name={q.id}
                            value={v}
                            checked={likertResponses[q.id] === v}
                            onChange={() => handleLikertChange(q.id, v)}
                            style={{ cursor: 'pointer' }}
                          />
                          {v}
                        </label>
                      ))}
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>Strongly Agree</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Part 3: Free-Text Feedback */}
            <div style={{ background: 'var(--bg-soft, #FFFFFF)', border: '1px solid var(--border, #E2E8F0)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text-dark, #0F172A)' }}>
                Qualitative Feedback & Comments
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted, #64748B)' }}>
                Share specific thoughts on what worked well, what was confusing, or what features you would like added.
              </p>
              <textarea
                rows={4}
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Optional comments or suggestions..."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid var(--border, #CBD5E1)',
                  fontSize: 13,
                  background: 'var(--bg, #FFFFFF)',
                  color: 'var(--text-dark, #0F172A)',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '12px 16px', color: '#DC2626', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '14px 28px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 700,
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
              }}
            >
              <Send size={16} />
              {submitting ? 'Submitting Study Feedback...' : 'Submit Evaluation Feedback'}
            </button>
          </form>
        )}

      </div>
    </AppLayout>
  )
}
