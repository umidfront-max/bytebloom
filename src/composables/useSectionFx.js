import { ref, onMounted, onUnmounted } from 'vue'

// Bo'lim fon effektlari uchun umumiy mantiq:
//  - kursor holati CSS o'zgaruvchilariga yoziladi: --cx/--cy (%), --px/--py (-0.5..0.5)
//  - `pointer` — canvas effektlari uchun piksel koordinatalar (reaktiv emas)
//  - bo'lim ekrandan tashqarida bo'lsa `paused` = true (animatsiyalar to'xtaydi)
export function useSectionFx() {
  const el = ref(null)
  const hover = ref(false)
  const paused = ref(true)
  const pointer = { x: 0, y: 0, active: false }

  let raf = 0, io, lastX = 0, lastY = 0

  function onMove(e) {
    if (e.pointerType !== 'mouse') return
    hover.value = true
    lastX = e.clientX
    lastY = e.clientY
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      const s = el.value
      if (!s) return
      const r = s.getBoundingClientRect()
      const px = (lastX - r.left) / r.width
      const py = (lastY - r.top) / r.height
      pointer.x = lastX - r.left
      pointer.y = lastY - r.top
      pointer.active = true
      s.style.setProperty('--cx', `${(px * 100).toFixed(2)}%`)
      s.style.setProperty('--cy', `${(py * 100).toFixed(2)}%`)
      s.style.setProperty('--px', (px - 0.5).toFixed(3))
      s.style.setProperty('--py', (py - 0.5).toFixed(3))
    })
  }

  function onLeave() {
    hover.value = false
    pointer.active = false
    el.value?.style.setProperty('--px', '0')
    el.value?.style.setProperty('--py', '0')
  }

  onMounted(() => {
    io = new IntersectionObserver(([e]) => { paused.value = !e.isIntersecting }, { rootMargin: '80px 0px' })
    io.observe(el.value)
  })
  onUnmounted(() => {
    io?.disconnect()
    cancelAnimationFrame(raf)
  })

  return { el, hover, paused, pointer, onMove, onLeave }
}
