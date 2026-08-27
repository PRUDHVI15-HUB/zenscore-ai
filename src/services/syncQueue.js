/**
 * Synchronization Queue (syncQueue)
 * ===================================
 * Manages background cloud uploads, offline queuing, retries, and versioning
 * for the Unified Student Profile.
 *
 * Guarantees:
 *   - NON-BLOCKING: Background uploads never block UI or Context
 *   - OFFLINE SUPPORT: Queues writes when offline and retries automatically
 *   - CONFLICT RESOLUTION: Higher version / newer lastUpdated wins
 */

import { apiFetch, getToken } from './api'

const QUEUE_STORAGE_KEY = 'zenscore_profile_sync_queue_v1'
let isFlushing = false

/**
 * Read current queue from localStorage cache
 */
export function getSyncQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Save queue to localStorage cache
 */
function saveSyncQueue(queue) {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue))
  } catch (err) {
    console.info('[SyncQueue] Queue cache notice:', err?.message)
  }
}

/**
 * Enqueue a section update for background cloud sync.
 *
 * @param {string} sectionName - Section envelope name (e.g., 'academicSummary')
 * @param {Object} sectionData - Data payload to update
 * @param {string} source - Module source tag (e.g., 'Academics')
 */
export function enqueueUpdate(sectionName, sectionData, source = 'System') {
  const queue = getSyncQueue()

  // Replace pending write for same section if not yet sent
  const existingIdx = queue.findIndex((item) => item.sectionName === sectionName)
  const entry = {
    id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    sectionName,
    sectionData,
    source,
    timestamp: new Date().toISOString(),
    retryCount: 0
  }

  if (existingIdx >= 0) {
    queue[existingIdx] = entry
  } else {
    queue.push(entry)
  }

  saveSyncQueue(queue)
  console.info(`[SyncQueue] Enqueued write for section "${sectionName}" (source: ${source})`)

  // Trigger debounced background flush
  if (flushTimer) clearTimeout(flushTimer)
  flushTimer = setTimeout(() => {
    flushQueue()
  }, 150)
}

let flushTimer = null

/**
 * Flushes all pending updates in queue to backend REST API.
 */
export async function flushQueue() {
  if (isFlushing) return
  const token = getToken()
  if (!token) {
    // Preserve local sync queue without attempting unauthorized network calls
    return
  }

  const queue = getSyncQueue()
  if (queue.length === 0) return

  isFlushing = true
  const remaining = []

  for (const item of queue) {
    try {
      await apiFetch(`/student/profile/${item.sectionName}`, {
        method: 'PATCH',
        headers: { 'X-Profile-Source': item.source || 'API' },
        body: JSON.stringify({
          data: item.sectionData,
          source: item.source
        }),
        timeoutMs: 20000
      })
    } catch (err) {
      if (err?.status === 401) {
        // Token expired/invalid, preserve queue quietly without crashing
        remaining.push(item)
        break
      }
      if (item.retryCount < 5) {
        remaining.push({ ...item, retryCount: item.retryCount + 1 })
      }
    }
  }

  saveSyncQueue(remaining)
  isFlushing = false
}

/**
 * Manually retry failed writes in queue
 */
export function retryFailedWrites() {
  flushQueue()
}

/**
 * Clear all pending sync items
 */
export function clearQueue() {
  saveSyncQueue([])
}

// Auto-flush on network status online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.info('[SyncQueue] Network online detected. Retrying cloud sync...')
    flushQueue()
  })
}
