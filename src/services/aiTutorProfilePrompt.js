/**
 * AI Tutor Action Tag Parser
 * ===========================
 * Parses [ACTION: {...}] tags out of AI reply text for client-side action execution.
 */

/**
 * Parses [ACTION: {...}] tags out of AI reply text.
 *
 * @param {string} replyText - Raw response text from LLM
 * @returns {{ cleanReply: string, actions: Array<{ type: string, payload: Object }> }}
 */
export function parseAIActions(replyText = '') {
  if (!replyText || typeof replyText !== 'string') return { cleanReply: '', actions: [] }

  const actions = []
  const actionRegex = /\[ACTION:\s*(\{[\s\S]*?\})\]/gi
  let match
  let cleanReply = replyText

  while ((match = actionRegex.exec(replyText)) !== null) {
    try {
      const parsed = JSON.parse(match[1])
      if (parsed && parsed.type) {
        actions.push(parsed)
      }
    } catch (e) {
      console.info('[AIActionParser] Failed to parse action tag:', match[1])
    }
  }

  cleanReply = cleanReply.replace(actionRegex, '').trim()

  return { cleanReply, actions }
}


