import { apiFetch } from '../api'

/**
 * POST /api/resume/upload
 * Uploads real PDF or DOCX file to backend for text extraction & ATS analysis.
 */
export async function uploadResumeApi(file, targetCareer = '') {
  if (!file) throw new Error('Please select a valid resume file.')

  const formData = new FormData()
  formData.append('resume', file)
  if (targetCareer) {
    formData.append('targetCareer', targetCareer)
  }

  const data = await apiFetch('/resume/upload', {
    method: 'POST',
    body: formData,
    timeoutMs: 45000 // 45 sec timeout for text extraction & parsing
  })

  return data
}

/**
 * GET /api/resume
 * Retrieves resume history for authenticated user.
 */
export async function getResumesApi() {
  const data = await apiFetch('/resume', { method: 'GET' })
  return data?.resumes || []
}

/**
 * GET /api/resume/:id
 * Retrieves detailed parsed resume by ID.
 */
export async function getResumeApi(id) {
  if (!id) return null
  const data = await apiFetch(`/resume/${id}`, { method: 'GET' })
  return data?.resume || null
}

/**
 * DELETE /api/resume/:id
 * Deletes specific resume for authenticated user.
 */
export async function deleteResumeApi(id) {
  if (!id) return false
  const data = await apiFetch(`/resume/${id}`, { method: 'DELETE' })
  return data?.success || false
}

/**
 * POST /api/resume/job-match
 * Compares resume against target job description text.
 */
export async function matchJobDescriptionApi(jobDescription, resumeId = null, targetCareer = '') {
  if (!jobDescription) throw new Error('Job description text is required.')
  const data = await apiFetch('/resume/job-match', {
    method: 'POST',
    body: JSON.stringify({ resumeId, jobDescription, targetCareer })
  })
  return data?.jobMatch || null
}

// ── PHASE 7 RESUME DRAFT & IMPROVEMENT API HELPERS ──

export async function createResumeDraftApi(parentResumeId) {
  const data = await apiFetch(`/resume/${parentResumeId}/draft`, { method: 'POST' })
  return data?.draft || null
}

export async function getResumeDraftApi(parentResumeId) {
  const data = await apiFetch(`/resume/${parentResumeId}/draft`, { method: 'GET' })
  return data?.draft || null
}

export async function updateResumeDraftApi(draftId, updatedFields) {
  const data = await apiFetch(`/resume/${draftId}/draft`, {
    method: 'PATCH',
    body: JSON.stringify(updatedFields)
  })
  return data?.draft || null
}

export async function improveResumeSectionApi(section, content, targetCareer) {
  const data = await apiFetch('/resume/draft/improve', {
    method: 'POST',
    body: JSON.stringify({ section, content, targetCareer })
  })
  return data?.improvement || null
}

export async function finalizeResumeDraftApi(draftId, targetCareer) {
  const data = await apiFetch(`/resume/${draftId}/draft/finalize`, {
    method: 'POST',
    body: JSON.stringify({ targetCareer })
  })
  return data?.resume || null
}

export async function discardResumeDraftApi(draftId) {
  const data = await apiFetch(`/resume/${draftId}/draft`, { method: 'DELETE' })
  return data?.success || false
}

export async function getResumeVersionsApi(resumeId) {
  const data = await apiFetch(`/resume/${resumeId}/versions`, { method: 'GET' })
  return data?.versions || []
}
