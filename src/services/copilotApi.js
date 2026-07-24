/**
 * copilotApi.js
 * Lightweight API client dedicated to the AI Academic Copilot.
 * Mirrors the existing apiFetch pattern from api.js but is kept separate
 * to avoid coupling concerns.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const getToken = () => localStorage.getItem('zenscore_jwt')

/**
 * Makes an authenticated request to the backend.
 * Throws a structured error object on non-2xx responses.
 *
 * @param {string} endpoint - path relative to BASE_URL (e.g. '/academics/copilot/chat')
 * @param {RequestInit} options - fetch options (method, body, etc.)
 * @returns {Promise<Object>} parsed JSON response
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })
  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data?.message || 'API Error')
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

/**
 * Posts a question to the AI Academic Copilot.
 * @param {string} question
 * @param {Array<{role: string, content: string}>} conversationHistory
 * @returns {Promise<Object>} { success, data: { answer, suggestions, classification, timestamp } }
 */
export const askCopilot = (question, conversationHistory = []) =>
  apiFetch('/academics/copilot/chat', {
    method: 'POST',
    body: JSON.stringify({ question, conversationHistory }),
  })
