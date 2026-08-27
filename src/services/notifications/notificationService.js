import { apiFetch } from '../api'

/**
 * Fetches paginated notifications for the authenticated student.
 */
export const getNotifications = async ({ page = 1, limit = 20, unreadOnly = false } = {}) => {
  try {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      unreadOnly: String(unreadOnly)
    }).toString()

    const res = await apiFetch(`/notifications?${query}`, { method: 'GET' })
    return res || { success: false, notifications: [], unreadCount: 0 }
  } catch (error) {
    console.error('getNotifications API error:', error)
    return { success: false, notifications: [], unreadCount: 0, error: error.message }
  }
}

/**
 * Fetches current unread notification count.
 */
export const getUnreadNotificationCount = async () => {
  try {
    const res = await apiFetch('/notifications/unread-count', { method: 'GET' })
    return typeof res?.unreadCount === 'number' ? res.unreadCount : 0
  } catch (error) {
    console.error('getUnreadNotificationCount API error:', error)
    return 0
  }
}

/**
 * Marks a single notification as read.
 */
export const markNotificationAsRead = async (notificationId) => {
  if (!notificationId) return null
  try {
    return await apiFetch(`/notifications/${notificationId}/read`, { method: 'PATCH' })
  } catch (error) {
    console.error('markNotificationAsRead API error:', error)
    return null
  }
}

/**
 * Marks all notifications as read for authenticated student.
 */
export const markAllNotificationsAsRead = async () => {
  try {
    return await apiFetch('/notifications/read-all', { method: 'PATCH' })
  } catch (error) {
    console.error('markAllNotificationsAsRead API error:', error)
    return null
  }
}

/**
 * Deletes a notification.
 */
export const deleteNotification = async (notificationId) => {
  if (!notificationId) return null
  try {
    return await apiFetch(`/notifications/${notificationId}`, { method: 'DELETE' })
  } catch (error) {
    console.error('deleteNotification API error:', error)
    return null
  }
}


export default {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
}
