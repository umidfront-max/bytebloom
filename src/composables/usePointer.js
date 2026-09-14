// Sichqoncha bilan ishlaydigan mikro-interaksiyalar.
// Faqat aniq ko'rsatkichli qurilmalarda (touch ekranlarda o'chiq).
const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches

// v-spotlight: kartochka ichida kursor ortidan yuruvchi yorug'lik va chegara
export const vSpotlight = {
  mounted(el) {
    el.classList.add('spot')
    if (!finePointer()) return
    el._spotMove = (e) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    el.addEventListener('pointermove', el._spotMove, { passive: true })
  },
  unmounted(el) {
    if (el._spotMove) el.removeEventListener('pointermove', el._spotMove)
  },
}

// v-magnetic: tugma kursor tomon yengil tortiladi. v-magnetic="0.3" -> kuch
export const vMagnetic = {
  mounted(el, binding) {
    if (!finePointer()) return
    const strength = binding.value ?? 0.22
    let tx = 0, ty = 0
    el._magMove = (e) => {
      const r = el.getBoundingClientRect()
      // joriy siljishni ayiramiz, aks holda tugma "titraydi"
      const cx = r.left - tx + r.width / 2
      const cy = r.top - ty + r.height / 2
      tx = (e.clientX - cx) * strength
      ty = (e.clientY - cy) * strength
      el.style.setProperty('--tx', `${tx.toFixed(2)}px`)
      el.style.setProperty('--ty', `${ty.toFixed(2)}px`)
    }
    el._magLeave = () => {
      tx = ty = 0
      el.style.setProperty('--tx', '0px')
      el.style.setProperty('--ty', '0px')
    }
    el.addEventListener('pointermove', el._magMove, { passive: true })
    el.addEventListener('pointerleave', el._magLeave)
  },
  unmounted(el) {
    if (!el._magMove) return
    el.removeEventListener('pointermove', el._magMove)
    el.removeEventListener('pointerleave', el._magLeave)
  },
}
