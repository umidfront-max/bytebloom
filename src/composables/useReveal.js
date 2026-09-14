// v-reveal direktivasi: element ko'rinish maydoniga kirganda .is-visible qo'shadi.
// v-reveal="120"        -> kechikish (ms)
// v-reveal.left / .right / .scale -> kirish yo'nalishi
// Animatsiya tugagach .reveal klassi olib tashlanadi, shunda elementning o'z
// hover transitionlari (kartochkalar va h.k.) kechikishsiz ishlaydi.
const VARIANTS = ['left', 'right', 'scale']
let io

function cleanup(el) {
  el.classList.remove('reveal', ...VARIANTS.map((v) => `reveal-${v}`))
  el.style.removeProperty('--reveal-delay')
}

function observer() {
  if (io) return io
  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return
      const el = e.target
      el.classList.add('is-visible')
      io.unobserve(el)
      const delay = parseFloat(el.style.getPropertyValue('--reveal-delay')) || 0
      el._revealTimer = setTimeout(() => cleanup(el), delay + 1100)
    })
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' })
  return io
}

export const vReveal = {
  mounted(el, binding) {
    el.classList.add('reveal')
    const variant = VARIANTS.find((v) => binding.modifiers[v])
    if (variant) el.classList.add(`reveal-${variant}`)
    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
    observer().observe(el)
  },
  unmounted(el) {
    clearTimeout(el._revealTimer)
    io?.unobserve(el)
  },
}
