// Saytning public endpointlari (autentifikatsiyasiz).
import { api } from './client'

// Lead forma — backend o'zi Telegram guruhiga ham yuboradi
export const createLead = (payload) =>
  api('/api/public/leads', { method: 'POST', body: payload })

// Chat: sessiya ochish, xabar yuborish, tarixni o'qish
export const createChatSession = (payload) =>
  api('/api/public/chat/sessions', { method: 'POST', body: payload })

export const sendChatMessage = (shortId, content) =>
  api(`/api/public/chat/sessions/${shortId}/messages`, { method: 'POST', body: { content } })

export const fetchChatMessages = (shortId, after) =>
  api(`/api/public/chat/sessions/${shortId}/messages${after ? `?after=${encodeURIComponent(after)}` : ''}`)

// Chat vidjeti uchun salomlashish matni va tezkor tugmalar
export const fetchGreeting = () => api('/api/public/settings/greeting')
