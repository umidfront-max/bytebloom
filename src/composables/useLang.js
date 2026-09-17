import { ref, watch } from 'vue'

// Sayt tili — header'dagi tanlagich, lead forma va chat sessiyasi uchun umumiy.
// Backend UZ | RU | EN qiymatlarini kutadi.
const KEY = 'bb-lang'
const LANGS = ['UZ', 'RU', 'EN']

const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null
const lang = ref(LANGS.includes(saved) ? saved : 'UZ')

watch(lang, (v) => {
  try { localStorage.setItem(KEY, v) } catch { /* private rejimda localStorage yopiq bo'lishi mumkin */ }
})

export function useLang() {
  return { lang, langs: LANGS }
}
