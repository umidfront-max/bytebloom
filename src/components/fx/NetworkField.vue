<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

// Suzuvchi tugunlar tarmog'i. Yaqin tugunlar chiziq bilan bog'lanadi,
// kursor tugunlarni yengil itaradi va o'ziga "ulanadi".
const props = defineProps({
  paused: Boolean,
  pointer: { type: Object, default: () => ({ x: 0, y: 0, active: false }) },
})

const canvas = ref(null)
const LINK = 140
const MOUSE = 190
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

let ctx, ro, raf = 0
let w = 0, h = 0
let pts = []

function seed() {
  const n = Math.round(Math.min(80, Math.max(22, (w * h) / 17000)))
  pts = Array.from({ length: n }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    r: Math.random() * 1.3 + 0.9,
  }))
}

function resize() {
  const c = canvas.value
  if (!c) return
  const r = c.getBoundingClientRect()
  const dpr = Math.min(devicePixelRatio || 1, 2)
  w = r.width
  h = r.height
  c.width = Math.round(w * dpr)
  c.height = Math.round(h * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  seed()
  draw()
}

function step() {
  const m = props.pointer
  for (const p of pts) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20
    if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20
    if (m.active) {
      const dx = p.x - m.x, dy = p.y - m.y
      const d = Math.hypot(dx, dy)
      if (d < MOUSE && d > 0.1) {
        const f = (1 - d / MOUSE) * 0.9
        p.x += (dx / d) * f
        p.y += (dy / d) * f
      }
    }
  }
}

function draw() {
  const dark = document.documentElement.dataset.theme === 'dark'
  const base = dark ? '94, 234, 212' : '37, 71, 168'
  const link = dark ? '45, 212, 191' : '13, 148, 136'
  const lineA = dark ? 0.26 : 0.34
  const m = props.pointer
  ctx.clearRect(0, 0, w, h)
  ctx.lineWidth = 1

  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    for (let j = i + 1; j < pts.length; j++) {
      const b = pts[j]
      const dx = a.x - b.x, dy = a.y - b.y
      const d2 = dx * dx + dy * dy
      if (d2 > LINK * LINK) continue
      ctx.strokeStyle = `rgba(${base}, ${(1 - Math.sqrt(d2) / LINK) * lineA})`
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
    if (m.active) {
      const d = Math.hypot(a.x - m.x, a.y - m.y)
      if (d < MOUSE * 1.25) {
        ctx.strokeStyle = `rgba(${link}, ${(1 - d / (MOUSE * 1.25)) * (dark ? 0.55 : 0.7)})`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(m.x, m.y)
        ctx.stroke()
      }
    }
  }

  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]
    // Har uchinchi tugun — teal rangli, biroz kattaroq (urg'u)
    const accent = i % 3 === 0
    ctx.fillStyle = accent ? `rgba(${link}, ${dark ? 0.85 : 0.8})` : `rgba(${base}, ${dark ? 0.6 : 0.55})`
    ctx.beginPath()
    ctx.arc(p.x, p.y, accent ? p.r + 0.6 : p.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function loop() {
  step()
  draw()
  raf = requestAnimationFrame(loop)
}
function start() { if (!raf && !reduce) raf = requestAnimationFrame(loop) }
function stop() { cancelAnimationFrame(raf); raf = 0 }

watch(() => props.paused, (p) => (p ? stop() : start()))

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  ro = new ResizeObserver(resize)
  ro.observe(canvas.value)
  if (!props.paused) start()
})
onUnmounted(() => {
  stop()
  ro?.disconnect()
})
</script>

<template>
  <canvas ref="canvas" class="network"></canvas>
</template>

<style scoped>
.network { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
</style>
