// Backend bilan ishlash uchun yagona nuqta.
// Manzil .env dagi VITE_API_BASE_URL orqali beriladi (.env.example ga qarang).
const BASE = (import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.58:8082').replace(/\/+$/, '')

export const apiUrl = (path) => `${BASE}${path}`

export class ApiError extends Error {
  constructor(message, status, body = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

// Status kodlar uchun zaxira xabarlar — backend `message` bermasa ishlatiladi
const FALLBACK = {
  0: 'Serverga ulanib bo‘lmadi. Internet aloqangizni tekshiring.',
  400: 'Ma’lumotlar to‘liq emas yoki noto‘g‘ri formatda.',
  404: 'So‘ralgan ma’lumot topilmadi.',
  429: 'Juda ko‘p so‘rov yuborildi. Bir daqiqadan keyin qayta urinib ko‘ring.',
  500: 'Serverda xatolik yuz berdi. Birozdan keyin qayta urinib ko‘ring.',
}
const fallbackMessage = (status) => FALLBACK[status] || 'Kutilmagan xatolik yuz berdi.'

const parseJson = (text) => {
  try { return JSON.parse(text) } catch { return null }
}

export async function api(path, { method = 'GET', body, signal } = {}) {
  let res
  try {
    res = await fetch(apiUrl(path), {
      method,
      // refresh cookie va CORS credentials uchun (hujjatning 1-bo'limi)
      credentials: 'include',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (e) {
    if (e?.name === 'AbortError') throw e
    throw new ApiError(FALLBACK[0], 0)
  }

  const text = res.status === 204 ? '' : await res.text()
  const data = text ? parseJson(text) : null

  if (!res.ok) {
    // Backend xatolikni {timestamp, status, error, message, path} shaklida qaytaradi
    throw new ApiError(data?.message || fallbackMessage(res.status), res.status, data)
  }
  return data
}
