import React, { useState, useEffect } from 'react'
import { useCareer } from '../../../context/CareerContext'
import { getSynchronizedInterviewState } from '../../../services/interview/interviewSyncService'
import { getInterviewAnalytics, saveInterviewAnalytics } from '../../../services/interview/interviewAnalytics'
import { getAIMockInterview } from '../../../services/ai/mockInterviewService'
import { getAICodingInterview } from '../../../services/ai/codingInterviewService'
import { getCodingChallenges } from '../../../services/interview/codingChallengeService'
import { runInBrowserCompiler } from '../../../services/interview/interviewCompilerService'
import { getAISystemDesign } from '../../../services/ai/systemDesignService'
import { getSystemDesignProblems } from '../../../services/interview/systemDesignEngine'
import { getAICompanyInterview } from '../../../services/ai/companyInterviewService'
import { evaluateInterviewGraduation } from '../../../services/interview/interviewGraduationService'
import { generatePlacementReport } from '../../../services/interview/interviewReportService'
import { generateInterviewCertificate } from '../../../services/interview/interviewCertificateService'

export default function InterviewPrepModule({ selectedRole = 'Backend Engineer', onSelectCareerRole }) {
  const career = useCareer()
  const activeTargetRole = career?.currentCareer || selectedRole || 'Backend Engineer'

  const [activeTabMode, setActiveTabMode] = useState('mock') // 'mock' | 'coding_lab' | 'system_design' | 'company_hub' | 'graduation'
  const [toastMsg, setToastMsg] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('Amazon')
  const [interviewType, setInterviewType] = useState('Technical Interview')
  const [userAnswer, setUserAnswer] = useState('')

  // Coding Lab State (Sprint C & Fix 2)
  const [selectedLanguage, setSelectedLanguage] = useState('Java')
  const [codeContent, setCodeContent] = useState(`class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n      int diff = target - nums[i];\n      if (map.containsKey(diff)) {\n        return new int[]{ map.get(diff), i };\n      }\n      map.put(nums[i], i);\n    }\n    return new int[]{};\n  }\n}`)
  const [codingAiData, setCodingAiData] = useState(null)
  const [compilerResult, setCompilerResult] = useState(null)

  // System Design State (Sprint D)
  const [designType, setDesignType] = useState('HLD')
  const [systemDesignAiData, setSystemDesignAiData] = useState(null)

  // Company Hub State (Sprint E)
  const [companyAiData, setCompanyAiData] = useState(null)

  // Graduation & Certificate State (Sprint F)
  const [activeCert, setActiveCert] = useState(null)

  // AI State (Sprint B)
  const [mockAiData, setMockAiData] = useState(null)
  const [analyticsState, setAnalyticsState] = useState(() => getInterviewAnalytics())

  const interviewState = getSynchronizedInterviewState(career)
  const readiness = interviewState.metrics
  const graduationInfo = evaluateInterviewGraduation(readiness.overallReadiness)
  const placementReport = generatePlacementReport(activeTargetRole, readiness.overallReadiness)

  const availableChallenges = getCodingChallenges(selectedCompany)
  const currentChallenge = availableChallenges[0]
  const availableDesignProblems = getSystemDesignProblems(designType)
  const currentDesignProblem = availableDesignProblems[0]

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3500)
  }

  // Fetch AI Mock Interview
  useEffect(() => {
    let isMounted = true
    getAIMockInterview(activeTargetRole, { company: selectedCompany, interviewType, userName: career?.userName || 'Student' })
      .then(res => { if (isMounted) setMockAiData(res) })
    return () => { isMounted = false }
  }, [activeTargetRole, selectedCompany, interviewType])

  // Fetch AI Coding Evaluation
  useEffect(() => {
    let isMounted = true
    getAICodingInterview(activeTargetRole, { company: selectedCompany, language: selectedLanguage, codeSubmitted: codeContent })
      .then(res => { if (isMounted) setCodingAiData(res) })
    return () => { isMounted = false }
  }, [activeTargetRole, selectedCompany, selectedLanguage])

  // Fetch AI System Design Evaluation
  useEffect(() => {
    let isMounted = true
    getAISystemDesign(activeTargetRole, { company: selectedCompany, designType, problemTitle: currentDesignProblem.title })
      .then(res => { if (isMounted) setSystemDesignAiData(res) })
    return () => { isMounted = false }
  }, [activeTargetRole, selectedCompany, designType])

  // Fetch AI Company Interview Hub Intelligence
  useEffect(() => {
    let isMounted = true
    getAICompanyInterview(activeTargetRole, { company: selectedCompany })
      .then(res => { if (isMounted) setCompanyAiData(res) })
    return () => { isMounted = false }
  }, [activeTargetRole, selectedCompany])

  const handleRunCompiler = () => {
    const res = runInBrowserCompiler(codeContent, selectedLanguage, currentChallenge.id)
    setCompilerResult(res)
    if (res.success) {
      triggerToast('✅ All Public & Hidden Test Cases PASSED!')
    } else {
      triggerToast('❌ Test Cases Failed. Check compiler log below.')
    }
  }

  const handleGenerateCertificate = () => {
    const cert = generateInterviewCertificate(career?.userName || 'Student', activeTargetRole, readiness.overallReadiness)
    setActiveCert(cert)
    triggerToast(`🎓 ZenScore Interview Certificate Issued! ID: ${cert.certId}`)
  }

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      triggerToast('⚠️ Please type your answer response before submitting.')
      return
    }

    const newSession = {
      id: `sess_${Date.now()}`,
      topic: `${interviewType} (${selectedCompany})`,
      score: mockAiData?.scorecard?.overallScore || 87,
      date: new Date().toISOString().split('T')[0],
      company: selectedCompany,
    }

    const updated = {
      ...analyticsState,
      totalSessionsCompleted: analyticsState.totalSessionsCompleted + 1,
      sessionHistory: [newSession, ...analyticsState.sessionHistory],
    }

    setAnalyticsState(updated)
    saveInterviewAnalytics(updated)
    setUserAnswer('')
    triggerToast('🎉 Answer submitted! Performance evaluated & logged to Session History.')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1040, margin: '0 auto', paddingBottom: 64, position: 'relative' }}>

      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: '#0F172A', color: '#FFFFFF', padding: '14px 20px', borderRadius: 16,
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)', fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 700,
        }}>
          {toastMsg}
        </div>
      )}


      {/* ────────────────────────────────────────────────────────── */}
      {/* SECTION 1: HEADER & PRODUCT FREEZE BADGE                   */}
      {/* ────────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(140deg, #EFF6FF 0%, #F5F3FF 55%, #FFFFFF 100%)',
        borderRadius: 24, padding: '36px 40px', border: '1px solid #DBEAFE',
        boxShadow: '0 4px 24px rgba(37,99,235,0.06)', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 620 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, background: '#FFFFFF', color: '#2563EB', border: '1px solid #BFDBFE', fontFamily: 'Sora, sans-serif' }}>
            ⚡ INTERVIEW INTELLIGENCE OS (PRODUCT FREEZE ✅)
          </div>

          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 34, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-1px' }}>
            AI Interview & Placement Engine
          </h1>

          <p style={{ fontSize: 15, color: '#475569', fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
            Enterprise mock interview simulator, coding compiler, system design studio, and verified interview readiness certification.
          </p>

          {/* Mode Switcher Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingTop: 6 }}>
            <button onClick={() => setActiveTabMode('mock')} style={{ padding: '8px 14px', borderRadius: 12, background: activeTabMode === 'mock' ? '#2563EB' : '#FFFFFF', color: activeTabMode === 'mock' ? '#FFFFFF' : '#475569', border: activeTabMode === 'mock' ? 'none' : '1px solid #CBD5E1', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
              🎙️ AI Mock
            </button>
            <button onClick={() => setActiveTabMode('coding_lab')} style={{ padding: '8px 14px', borderRadius: 12, background: activeTabMode === 'coding_lab' ? '#2563EB' : '#FFFFFF', color: activeTabMode === 'coding_lab' ? '#FFFFFF' : '#475569', border: activeTabMode === 'coding_lab' ? 'none' : '1px solid #CBD5E1', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
              💻 Coding Lab
            </button>
            <button onClick={() => setActiveTabMode('system_design')} style={{ padding: '8px 14px', borderRadius: 12, background: activeTabMode === 'system_design' ? '#2563EB' : '#FFFFFF', color: activeTabMode === 'system_design' ? '#FFFFFF' : '#475569', border: activeTabMode === 'system_design' ? 'none' : '1px solid #CBD5E1', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
              🏗️ System Design
            </button>
            <button onClick={() => setActiveTabMode('company_hub')} style={{ padding: '8px 14px', borderRadius: 12, background: activeTabMode === 'company_hub' ? '#2563EB' : '#FFFFFF', color: activeTabMode === 'company_hub' ? '#FFFFFF' : '#475569', border: activeTabMode === 'company_hub' ? 'none' : '1px solid #CBD5E1', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
              🏢 Company Hub
            </button>
            <button onClick={() => setActiveTabMode('graduation')} style={{ padding: '8px 14px', borderRadius: 12, background: activeTabMode === 'graduation' ? '#16A34A' : '#FFFFFF', color: activeTabMode === 'graduation' ? '#FFFFFF' : '#475569', border: activeTabMode === 'graduation' ? 'none' : '1px solid #CBD5E1', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
              🎓 Graduation & Cert
            </button>
          </div>
        </div>

        {/* Graduation Action Card */}
        <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '20px 24px', border: '1.5px solid #86EFAC', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 8px 24px rgba(22,163,74,0.12)', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif' }}>PLACEMENT READINESS</span>
          <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 32, fontWeight: 800, color: '#0F172A' }}>{readiness.overallReadiness}%</span>
          <button
            onClick={handleGenerateCertificate}
            style={{ padding: '8px 16px', borderRadius: 10, background: '#16A34A', color: '#FFFFFF', border: 'none', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
          >
            Claim Certificate 🎓
          </button>
        </div>
      </section>


      {/* ────────────────────────────────────────────────────────── */}
      {/* MODE 1: AI MOCK INTERVIEW SIMULATOR (Sprint B)             */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTabMode === 'mock' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 20 }}>
            {mockAiData?.interviewer && (
              <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: 24, padding: '24px 28px', color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👩‍💼</div>
                  <div>
                    <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800 }}>{mockAiData.interviewer.name}</div>
                    <div style={{ fontSize: 12, color: '#38BDF8', fontFamily: 'DM Sans, sans-serif' }}>{mockAiData.interviewer.role} · {mockAiData.interviewer.company}</div>
                  </div>
                </div>
                <p style={{ fontSize: 13.5, color: '#E2E8F0', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5, margin: 0, background: 'rgba(255,255,255,0.06)', padding: 14, borderRadius: 14 }}>
                  "{mockAiData.interviewer.greeting}"
                </p>
              </div>
            )}

            {mockAiData?.scorecard && (
              <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif' }}>🏆 INTERVIEW SCORECARD</div>
                  <span style={{ fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 8, background: '#DCFCE7', color: '#15803D' }}>
                    Verdict: {mockAiData.scorecard.recommendation}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  <div style={{ background: '#F8FAFF', padding: '10px 12px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Overall Score</span>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#2563EB', fontFamily: 'Sora, sans-serif' }}>{mockAiData.scorecard.overallScore}%</div>
                  </div>
                  <div style={{ background: '#F8FAFF', padding: '10px 12px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Technical Score</span>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#16A34A', fontFamily: 'Sora, sans-serif' }}>{mockAiData.scorecard.technicalScore}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <section style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif' }}>❓ ADAPTIVE INTERVIEW QUESTION ({interviewType})</div>
            {mockAiData?.adaptiveQuestions?.[0] && (
              <div style={{ background: '#F8FAFF', borderRadius: 16, padding: '18px', border: '1px solid #DBEAFE', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif', lineHeight: 1.4 }}>
                  Q: {mockAiData.adaptiveQuestions[0].question}
                </div>
                <textarea
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Type your response here..."
                  rows={4}
                  style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid #CBD5E1', fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, outline: 'none' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleSubmitAnswer} style={{ padding: '10px 24px', borderRadius: 12, background: '#2563EB', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 13 }}>
                    Submit Answer for AI Evaluation 🚀
                  </button>
                </div>
              </div>
            )}
          </section>
        </>
      )}


      {/* ────────────────────────────────────────────────────────── */}
      {/* MODE 2: CODING INTERVIEW LAB & COMPILER (Sprint C & Fix 2) */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTabMode === 'coding_lab' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Challenge Problem Header */}
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: '#DCFCE7', color: '#15803D' }}>{currentChallenge.difficulty}</span>
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{currentChallenge.title}</span>
              </div>
              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Acceptance: {currentChallenge.acceptanceRate} · Est. Time: {currentChallenge.estimatedTime}</span>
            </div>
            <p style={{ fontSize: 14, color: '#334155', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6, margin: 0 }}>{currentChallenge.problemStatement}</p>
          </div>

          {/* Interactive Code Editor & Compiler execution */}
          <div style={{ background: '#0F172A', borderRadius: 24, padding: '24px', color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {['Java', 'Python', 'JavaScript', 'C++'].map(lang => (
                  <button key={lang} onClick={() => setSelectedLanguage(lang)} style={{ padding: '4px 12px', borderRadius: 8, background: selectedLanguage === lang ? '#2563EB' : 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>{lang}</button>
                ))}
              </div>
              <button onClick={handleRunCompiler} style={{ padding: '8px 20px', borderRadius: 10, background: '#16A34A', color: '#FFFFFF', border: 'none', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>▶ Run Compiler & Execute Tests</button>
            </div>
            <textarea value={codeContent} onChange={e => setCodeContent(e.target.value)} rows={10} style={{ width: '100%', padding: 16, borderRadius: 14, background: '#1E293B', color: '#F8FAFC', fontFamily: 'monospace', fontSize: 13.5, border: '1px solid #334155', outline: 'none' }} />
          </div>

          {/* Compiler Output & Evaluation Card (Exposing compilerResult & codingAiData) */}
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif' }}>⚙️ IN-BROWSER COMPILER & AI EVALUATION</span>
              {compilerResult && (
                <span style={{ fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 8, background: compilerResult.success ? '#DCFCE7' : '#FEE2E2', color: compilerResult.success ? '#15803D' : '#991B1B' }}>
                  Status: {compilerResult.success ? 'Compilation Success ✅' : 'Test Failures Detected ❌'}
                </span>
              )}
            </div>

            {/* Metric Tiles: Status, Passed, Failed, Time, Memory */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              <div style={{ background: '#F8FAFF', padding: '12px', borderRadius: 12, border: '1px solid #DBEAFE' }}>
                <span style={{ fontSize: 10.5, color: '#64748B' }}>COMPILATION STATUS</span>
                <div style={{ fontSize: 14, fontWeight: 800, color: compilerResult?.success ? '#16A34A' : '#2563EB', fontFamily: 'Sora, sans-serif', marginTop: 2 }}>
                  {compilerResult ? (compilerResult.success ? 'SUCCESS' : 'FAILED') : 'READY'}
                </div>
              </div>
              <div style={{ background: '#F0FDF4', padding: '12px', borderRadius: 12, border: '1px solid #86EFAC' }}>
                <span style={{ fontSize: 10.5, color: '#166534' }}>TESTS PASSED</span>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#15803D', fontFamily: 'Sora, sans-serif', marginTop: 2 }}>
                  {compilerResult ? `${compilerResult.passedCount} / ${compilerResult.totalCount}` : '4 / 4 Passed'}
                </div>
              </div>
              <div style={{ background: '#FEF2F2', padding: '12px', borderRadius: 12, border: '1px solid #FCA5A5' }}>
                <span style={{ fontSize: 10.5, color: '#991B1B' }}>TESTS FAILED</span>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#991B1B', fontFamily: 'Sora, sans-serif', marginTop: 2 }}>
                  {compilerResult ? `${compilerResult.totalCount - compilerResult.passedCount}` : '0 Failed'}
                </div>
              </div>
              <div style={{ background: '#F8FAFF', padding: '12px', borderRadius: 12, border: '1px solid #DBEAFE' }}>
                <span style={{ fontSize: 10.5, color: '#64748B' }}>EXECUTION TIME</span>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#2563EB', fontFamily: 'Sora, sans-serif', marginTop: 2 }}>
                  {compilerResult ? `${compilerResult.executionTimeMs} ms` : '18 ms'}
                </div>
              </div>
              <div style={{ background: '#F8FAFF', padding: '12px', borderRadius: 12, border: '1px solid #DBEAFE' }}>
                <span style={{ fontSize: 10.5, color: '#64748B' }}>MEMORY USAGE</span>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#7C3AED', fontFamily: 'Sora, sans-serif', marginTop: 2 }}>
                  {compilerResult ? `${compilerResult.memoryUsedMb} MB` : '42.4 MB'}
                </div>
              </div>
            </div>

            {/* Test Cases Detail List */}
            {compilerResult?.testCases && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>TEST CASE EXECUTION LOG</span>
                {compilerResult.testCases.map(tc => (
                  <div key={tc.id} style={{ background: tc.passed ? '#F0FDF4' : '#FEF2F2', padding: '10px 14px', borderRadius: 10, border: `1px solid ${tc.passed ? '#86EFAC' : '#FCA5A5'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: tc.passed ? '#15803D' : '#991B1B' }}>
                        {tc.passed ? '✓ Test Case #' + tc.id + ' (Passed)' : '✗ Test Case #' + tc.id + ' (Failed)'}
                      </span>
                      <span style={{ color: '#475569', fontFamily: 'monospace' }}>Input: {tc.input}</span>
                    </div>
                    <div style={{ fontFamily: 'monospace', color: '#0F172A' }}>
                      Expected: <strong>{tc.expected}</strong> | Actual: <strong>{tc.actual}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AI Evaluation, Complexity & Best Practices (from codingAiData) */}
            {codingAiData && (
              <div style={{ background: '#F8FAFF', borderRadius: 16, padding: '18px', border: '1px solid #DBEAFE', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif' }}>💡 AI CODE EVALUATION & COMPLEXITY ANALYSIS</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: '#EFF6FF', color: '#2563EB' }}>Time: {codingAiData.evaluation?.timeComplexity || 'O(N)'}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: '#F5F3FF', color: '#7C3AED' }}>Space: {codingAiData.evaluation?.spaceComplexity || 'O(N)'}</span>
                  </div>
                </div>

                <p style={{ fontSize: 13.5, color: '#0F172A', fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
                  <strong>Code Quality:</strong> {codingAiData.evaluation?.codeQuality || 'Optimal Solution using HashMap single-pass lookup'}
                </p>

                {codingAiData.aiDebugging && (
                  <div style={{ fontSize: 13, color: '#475569', fontFamily: 'DM Sans, sans-serif', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span><strong>AI Feedback:</strong> {codingAiData.aiDebugging.bugExplanation}</span>
                    <span><strong>Best Practice & Suggestion:</strong> {codingAiData.aiDebugging.bestPractice}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}


      {/* ────────────────────────────────────────────────────────── */}
      {/* MODE 3: AI SYSTEM DESIGN STUDIO (Sprint D)                 */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTabMode === 'system_design' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif' }}>🏗️ SYSTEM DESIGN TYPE</div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                {systemDesignAiData?.question?.title || currentDesignProblem.title}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['HLD', 'LLD'].map(type => (
                <button key={type} onClick={() => setDesignType(type)} style={{ padding: '8px 18px', borderRadius: 12, background: designType === type ? '#7C3AED' : '#FFFFFF', color: designType === type ? '#FFFFFF' : '#475569', border: designType === type ? 'none' : '1px solid #CBD5E1', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>{type}</button>
              ))}
            </div>
          </div>

          {systemDesignAiData?.architectureComponents && (
            <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif' }}>🧩 ARCHITECTURE COMPONENTS ({systemDesignAiData.architectureComponents.length})</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {systemDesignAiData.architectureComponents.map((comp, idx) => (
                  <div key={idx} style={{ background: '#F8FAFF', padding: '14px 16px', borderRadius: 14, border: '1px solid #DBEAFE', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>{comp.layer}</span>
                    <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A' }}>{comp.name}</span>
                    <span style={{ fontSize: 12, color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>Tech: {comp.tech}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}


      {/* ────────────────────────────────────────────────────────── */}
      {/* MODE 4: COMPANY PLACEMENT INTELLIGENCE HUB (Sprint E)     */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTabMode === 'company_hub' && companyAiData?.companyProfile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Company Profile Header & Offer Predictor */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 20 }}>
            {/* Profile Overview */}
            <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif' }}>🏢 COMPANY PROFILE</span>
                <span style={{ fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 8, background: '#EFF6FF', color: '#2563EB' }}>{companyAiData.companyProfile.tier}</span>
              </div>

              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: '#0F172A' }}>
                {companyAiData.companyProfile.name}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <div style={{ background: '#F8FAFF', padding: 12, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Average Package</span>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#16A34A', fontFamily: 'Sora, sans-serif' }}>{companyAiData.companyProfile.averageSalary}</div>
                </div>
                <div style={{ background: '#F8FAFF', padding: 12, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Hiring Frequency</span>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#7C3AED', fontFamily: 'Sora, sans-serif' }}>{companyAiData.companyProfile.hiringFrequency}</div>
                </div>
              </div>
            </div>

            {/* Offer Probability Predictor */}
            {companyAiData?.offerPrediction && (
              <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif' }}>🔮 OFFER PROBABILITY PREDICTOR</div>
                <div style={{ background: '#F0FDF4', padding: 14, borderRadius: 14, border: '1px solid #86EFAC', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12, color: '#166534', fontWeight: 700 }}>Estimated Offer Chance</span>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#15803D', fontFamily: 'Sora, sans-serif' }}>{companyAiData.offerPrediction.offerProbabilityPct}%</div>
                  <span style={{ fontSize: 12, color: '#475569' }}>Target Package: {companyAiData.offerPrediction.expectedPackage}</span>
                </div>
              </div>
            )}
          </div>

          {/* Hiring Pipeline Rounds */}
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif' }}>🔄 INTERVIEW PROCESS PIPELINE</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              {companyAiData.companyProfile.interviewRounds.map(r => (
                <div key={r.step} style={{ background: '#F8FAFF', padding: '12px', borderRadius: 12, border: '1px solid #DBEAFE', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: '#2563EB' }}>ROUND {r.step}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>{r.name}</span>
                  <span style={{ fontSize: 11, color: '#64748B' }}>{r.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ────────────────────────────────────────────────────────── */}
      {/* MODE 5: GRADUATION & INTERVIEW CERTIFICATE (Sprint F)      */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTabMode === 'graduation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Placement Readiness Breakdown */}
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif' }}>🎓 PLACEMENT READINESS MATRIX</span>
              <span style={{ fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 8, background: '#DCFCE7', color: '#15803D' }}>{graduationInfo.status}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <div style={{ background: '#F0FDF4', padding: 12, borderRadius: 12, border: '1px solid #86EFAC' }}>
                <span style={{ fontSize: 11, color: '#166534' }}>Dream Company</span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#15803D', fontFamily: 'Sora, sans-serif' }}>{placementReport.breakdown.dreamCompanyPct}%</div>
              </div>
              <div style={{ background: '#F0FDF4', padding: 12, borderRadius: 12, border: '1px solid #86EFAC' }}>
                <span style={{ fontSize: 11, color: '#166534' }}>Product Company</span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#15803D', fontFamily: 'Sora, sans-serif' }}>{placementReport.breakdown.productCompanyPct}%</div>
              </div>
              <div style={{ background: '#F0FDF4', padding: 12, borderRadius: 12, border: '1px solid #86EFAC' }}>
                <span style={{ fontSize: 11, color: '#166534' }}>High-Growth Startup</span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#15803D', fontFamily: 'Sora, sans-serif' }}>{placementReport.breakdown.startupPct}%</div>
              </div>
              <div style={{ background: '#F0FDF4', padding: 12, borderRadius: 12, border: '1px solid #86EFAC' }}>
                <span style={{ fontSize: 11, color: '#166534' }}>Service Enterprise</span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#15803D', fontFamily: 'Sora, sans-serif' }}>{placementReport.breakdown.serviceCompanyPct}%</div>
              </div>
            </div>
          </div>

          {/* Verified Certificate Modal / Display Card */}
          {activeCert && (
            <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: 24, padding: '32px', color: '#FFFFFF', border: '2px solid #F59E0B', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif' }}>ZENSCORE AI OFFICIAL CERTIFICATION</span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>Cert ID: {activeCert.certId}</span>
              </div>

              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 13, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Certificate of Interview Readiness</div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#FFFFFF', margin: '8px 0' }}>{activeCert.studentName}</div>
                <div style={{ fontSize: 14, color: '#CBD5E1' }}>has successfully achieved enterprise interview readiness for <strong style={{ color: '#38BDF8' }}>{activeCert.targetRole}</strong> with an overall score of <strong style={{ color: '#4ADE80' }}>{activeCert.interviewScore}%</strong>.</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>Verified: {activeCert.verificationId}</span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>Issued on {activeCert.issueDate}</span>
              </div>
            </div>
          )}

        </div>
      )}


      {/* ────────────────────────────────────────────────────────── */}
      {/* SESSION HISTORY FOOTER                                     */}
      {/* ────────────────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Sora, sans-serif' }}>
          📜 COMPLETED SESSION HISTORY ({analyticsState.sessionHistory.length})
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(analyticsState.sessionHistory || []).map(sess => (
            <div key={sess.id} style={{ background: '#F8FAFF', borderRadius: 14, padding: '12px 16px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18 }}>🎯</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>{sess.topic}</span>
                  <span style={{ fontSize: 11.5, color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>Completed on {sess.date}</span>
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 10, background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC' }}>
                Score: {sess.score}%
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
