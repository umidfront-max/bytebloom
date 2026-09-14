import { ref, watchEffect } from 'vue'

const KEY = 'bb-theme'
const theme = ref(document.documentElement.dataset.theme || 'light')

watchEffect(() => {
  document.documentElement.dataset.theme = theme.value
  localStorage.setItem(KEY, theme.value)
})

export function useTheme() {
  // Tugma markazidan doira bo'lib yoyiladigan mavzu almashishi (View Transitions API).
  // Qo'llab-quvvatlanmasa yoki reduced motion yoqilgan bo'lsa — oddiy almashadi.
  const toggle = (e) => {
    const next = theme.value === 'dark' ? 'light' : 'dark'
    const root = document.documentElement
    const apply = () => { theme.value = next; root.dataset.theme = next }

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce) return apply()

    const r = e?.currentTarget?.getBoundingClientRect?.()
    const x = r ? r.left + r.width / 2 : innerWidth / 2
    const y = r ? r.top + r.height / 2 : 0
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    root.classList.add('theme-switching')
    const vt = document.startViewTransition(apply)
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(.22, 1, .36, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
    vt.finished.finally(() => root.classList.remove('theme-switching'))
  }
  return { theme, toggle }
}
