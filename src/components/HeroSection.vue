<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const words = [
  { t: 'Axborot' },
  { t: 'tizimlarini' },
  { t: 'to‘liq siklda', accent: true },
  { t: 'joriy' },
  { t: 'qilamiz' },
]
const rows = [
  { label: 'Texnik topshiriq', status: 'TAYYOR', state: 'done' },
  { label: 'Davlat ekspertizasi', status: 'JARAYONDA', state: 'progress' },
  { label: 'Tizim joriy etish', status: 'NAVBATDA', state: 'queue' },
  { label: 'AX audit', status: 'REJADA', state: 'plan' },
]
const stats = [
  { big: '2022', small: 'yildan faoliyat' },
  { big: 'To‘liq sikl', small: 'hujjat → joriy etish' },
  { big: 'O‘zDST / ISO', small: 'me’yorlarga muvofiqlik' },
]

// Progress raqami sanashi (0 → 68), karta paydo bo'lgach boshlanadi
const progress = ref(0)
let countRaf = 0
onMounted(() => {
  const target = 68, dur = 1800, delay = 1000
  const start = performance.now()
  const tick = (t) => {
    const p = Math.min(1, Math.max(0, (t - start - delay) / dur))
    progress.value = Math.round(target * (1 - Math.pow(1 - p, 4)))
    if (p < 1) countRaf = requestAnimationFrame(tick)
  }
  countRaf = requestAnimationFrame(tick)
})

// Sichqonchaga qarab silliq 3D egilish + yaltirash.
// Qiymatlar to'g'ridan-to'g'ri CSS o'zgaruvchilariga yoziladi (Vue qayta render qilmaydi).
const visual = ref(null)
const target = { rx: 0, ry: 0, gx: 50, gy: 30 }
const cur = { ...target }
let tiltRaf = 0

function step() {
  let moving = false
  for (const k in cur) {
    const d = target[k] - cur[k]
    cur[k] += d * 0.1
    if (Math.abs(d) > 0.02) moving = true
  }
  const s = visual.value?.style
  if (s) {
    s.setProperty('--rx', `${cur.rx.toFixed(3)}deg`)
    s.setProperty('--ry', `${cur.ry.toFixed(3)}deg`)
    s.setProperty('--gx', `${cur.gx.toFixed(2)}%`)
    s.setProperty('--gy', `${cur.gy.toFixed(2)}%`)
  }
  tiltRaf = moving ? requestAnimationFrame(step) : 0
}
const kick = () => { if (!tiltRaf) tiltRaf = requestAnimationFrame(step) }

function onMove(e) {
  if (e.pointerType !== 'mouse') return
  // Egilmaydigan tashqi qobiq o'lchanadi — aks holda qiymatlar "sakraydi"
  const r = e.currentTarget.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width
  const py = (e.clientY - r.top) / r.height
  target.rx = (py - 0.5) * -8
  target.ry = (px - 0.5) * 10
  target.gx = px * 100
  target.gy = py * 100
  kick()
}
function onLeave() {
  target.rx = 0
  target.ry = 0
  kick()
}

onUnmounted(() => {
  cancelAnimationFrame(countRaf)
  cancelAnimationFrame(tiltRaf)
})
</script>

<template>
  <section class="hero" id="top">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <div class="eyebrow enter" style="animation-delay:.05s">
          <span class="pulse"></span> IT tizimlar <i>•</i> Hujjatlashtirish <i>•</i> Ekspertiza
        </div>

        <h1 aria-label="Axborot tizimlarini to‘liq siklda joriy qilamiz">
          <template v-for="(w, i) in words" :key="w.t">
            <span class="word" aria-hidden="true"><span
              class="word-in" :class="{ accent: w.accent }"
              :style="{ animationDelay: `${0.14 + i * 0.07}s` }"
            >{{ w.t }}</span></span>{{ ' ' }}
          </template>
        </h1>

        <p class="lead enter" style="animation-delay:.5s">Loyiha hujjatlaridan tortib joriy etish, ekspertiza va axborot xavfsizligi auditigacha — O‘zbekiston me’yorlariga mos yechim.</p>

        <div class="hero-actions enter" style="animation-delay:.6s">
          <a v-magnetic class="btn btn-teal" href="#xizmatlar">Xizmatlarni ko‘rish <span class="arr">→</span></a>
          <a v-magnetic class="btn btn-ghost" href="#aloqa">Loyihani muhokama qilish</a>
        </div>

        <div class="stats">
          <div
            v-for="(s, i) in stats" :key="s.big"
            v-spotlight
            class="stat enter" :style="{ animationDelay: `${0.7 + i * 0.08}s` }"
          >
            <b>{{ s.big }}</b><span>{{ s.small }}</span>
          </div>
        </div>
      </div>

      <div class="visual-shell enter" style="animation-delay:.3s" @pointermove="onMove" @pointerleave="onLeave">
        <div ref="visual" class="hero-visual">
          <div class="v-grid"></div>
          <div class="orb o1"></div>
          <div class="orb o2"></div>
          <div class="scan"></div>
          <div class="glare"></div>

          <div class="dash">
            <div class="dash-head">
              <h3>Loyiha holati <em>namuna</em></h3>
              <span class="live"><i></i> Jonli</span>
            </div>
            <div v-for="(r, i) in rows" :key="r.label" class="row" :style="{ animationDelay: `${0.75 + i * 0.12}s` }">
              <span class="row-label">
                <span class="state" :class="r.state">
                  <svg v-if="r.state === 'done'" viewBox="0 0 16 16"><path d="M4 8.5l2.5 2.5L12 5.5" /></svg>
                </span>
                {{ r.label }}
              </span>
              <span class="pill" :class="r.state">{{ r.status }}</span>
            </div>
            <div class="bar-head"><span>Umumiy holat</span><b>{{ progress }}%</b></div>
            <div class="bar"><i :style="{ width: `${progress}%` }"></i></div>
          </div>

          <p class="hero-note">Davlat va korporativ tizimlar uchun hujjatlar, dasturiy yechim va qo‘llab-quvvatlash bitta jamoada.</p>
        </div>

        <div class="float-card toast" aria-hidden="true">
          <span class="toast-ic">✓</span>
          <div><b>Ekspertiza xulosasi</b><span>Ijobiy · hozirgina</span></div>
        </div>
        <div class="float-card chip" aria-hidden="true">
          <span class="chip-dot"></span> O‘zDST · ISO muvofiq
        </div>
      </div>
    </div>

    <a class="scroll-cue enter" href="#xizmatlar" style="animation-delay:1.4s" aria-label="Pastga — xizmatlar">
      <span class="mouse"><i></i></span>
    </a>
  </section>
</template>

<style scoped>
.hero { padding: 80px 0 32px; position: relative; }
.hero-grid { display: grid; grid-template-columns: 1.05fr .95fr; gap: 56px; align-items: center; }

.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--eyebrow-bg); color: var(--eyebrow-text);
  border: 1px solid rgba(13, 148, 136, .18);
  border-radius: 999px; padding: 6px 14px 6px 10px; font-size: 12px; font-weight: 700; margin-bottom: 22px;
}
.eyebrow i { font-style: normal; opacity: .45; }
.pulse { position: relative; width: 8px; height: 8px; border-radius: 50%; background: var(--mint); }
.pulse::after {
  content: ""; position: absolute; inset: 0; border-radius: 50%; background: var(--mint);
  animation: pulse 1.8s var(--ease) infinite;
}
@keyframes pulse { from { transform: scale(1); opacity: .7; } to { transform: scale(3); opacity: 0; } }

h1 { font-size: clamp(38px, 5.2vw, 62px); line-height: 1.06; letter-spacing: -.045em; color: var(--heading); }
.word { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: .1em; margin-bottom: -.1em; }
.word-in {
  display: inline-block; transform: translateY(110%) rotate(6deg); transform-origin: left bottom;
  animation: wordUp 1s var(--ease) forwards;
}
@keyframes wordUp { to { transform: none; } }
.word-in.accent {
  background: linear-gradient(90deg, var(--teal), #34D399, #60A5FA, var(--teal));
  background-size: 220% auto;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  animation: wordUp 1s var(--ease) forwards, shine 6s linear infinite;
}
@keyframes shine { to { background-position: 220% center; } }

.lead { margin: 22px 0 32px; color: var(--muted); font-size: 17.5px; max-width: 540px; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }

.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 40px; }
.stat {
  background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 16px 16px 14px;
  box-shadow: var(--shadow-xs);
  transition: transform .4s var(--ease), box-shadow .4s var(--ease), border-color .3s, background-color .4s;
}
.stat:hover { transform: translateY(-4px); box-shadow: var(--shadow); border-color: var(--card-hover-border); }
.stat b { display: block; font-size: 21px; color: var(--heading); letter-spacing: -.02em; }
.stat span { color: var(--muted); font-size: 13px; }

/* Vizual karta */
.visual-shell { position: relative; }
.hero-visual {
  background: linear-gradient(160deg, #12275F, #1E3A8A 45%, #0D9488);
  border-radius: 28px; min-height: 440px; padding: 28px; color: #fff;
  position: relative; overflow: hidden;
  box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, .16);
  transform: perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  will-change: transform;
}
.v-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, .06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, .06) 1px, transparent 1px);
  background-size: 28px 28px;
  -webkit-mask-image: radial-gradient(circle at 80% 10%, #000, transparent 65%);
  mask-image: radial-gradient(circle at 80% 10%, #000, transparent 65%);
}
.orb { position: absolute; border-radius: 50%; pointer-events: none; }
.o1 {
  width: 260px; height: 260px; right: -60px; bottom: -70px;
  background: radial-gradient(closest-side, rgba(52, 211, 153, .45), transparent);
  animation: float 7s ease-in-out infinite;
}
.o2 {
  width: 200px; height: 200px; left: -60px; top: -50px;
  background: radial-gradient(closest-side, rgba(96, 165, 250, .35), transparent);
  animation: float 9s ease-in-out -3s infinite reverse;
}
@keyframes float { 50% { transform: translate(-22px, -18px) scale(1.1); } }
.scan {
  position: absolute; left: -20%; right: -20%; top: 0; height: 120px; pointer-events: none;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, .1), transparent);
  animation: scan 5.5s ease-in-out infinite;
}
@keyframes scan { from { transform: translateY(-130px); } to { transform: translateY(600px); } }
.glare {
  position: absolute; inset: 0; pointer-events: none; z-index: 2;
  background: radial-gradient(520px circle at var(--gx, 50%) var(--gy, 30%), rgba(255, 255, 255, .16), transparent 42%);
  opacity: 0; transition: opacity .5s var(--ease);
}
.visual-shell:hover .glare { opacity: 1; }

.dash {
  position: relative; z-index: 1; padding: 18px 18px 20px; border-radius: 18px;
  background: rgba(255, 255, 255, .09); border: 1px solid rgba(255, 255, 255, .16);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, .12), inset 0 1px 0 rgba(255, 255, 255, .12);
}
.dash-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.dash h3 { font-size: 15px; display: flex; align-items: center; gap: 8px; }
.dash h3 em { font-style: normal; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; opacity: .6; border: 1px solid rgba(255, 255, 255, .25); border-radius: 999px; padding: 1px 7px; }
.live { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #A7F3D0; }
.live i { width: 6px; height: 6px; border-radius: 50%; background: #34D399; animation: blink 1.6s ease-in-out infinite; }
@keyframes blink { 50% { opacity: .25; } }

.row {
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  font-size: 13px; padding: 10px 8px; margin-inline: -8px; border-radius: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, .08);
  opacity: 0; transform: translateX(-12px);
  animation: rowIn .6s var(--ease) forwards;
  transition: background-color .25s;
}
.row:hover { background: rgba(255, 255, 255, .06); }
@keyframes rowIn { to { opacity: 1; transform: none; } }
.row-label { display: inline-flex; align-items: center; gap: 10px; }
.state { width: 18px; height: 18px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; }
.state.done { background: #10B981; box-shadow: 0 0 0 4px rgba(16, 185, 129, .18); }
.state.done svg {
  width: 12px; height: 12px; fill: none; stroke: #052e2b; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 12; stroke-dashoffset: 12; animation: draw .5s 1.3s var(--ease) forwards;
}
@keyframes draw { to { stroke-dashoffset: 0; } }
.state.progress { border: 2px solid rgba(251, 191, 36, .3); border-top-color: #FBBF24; animation: rot 1s linear infinite; }
.state.queue { border: 2px solid rgba(255, 255, 255, .45); }
.state.plan { border: 2px dashed rgba(255, 255, 255, .3); }
@keyframes rot { to { transform: rotate(360deg); } }

.pill { font-size: 10.5px; font-weight: 800; letter-spacing: .04em; border-radius: 999px; padding: 4px 9px; white-space: nowrap; }
.pill.done { background: #10B981; color: #052e2b; }
.pill.progress { background: rgba(251, 191, 36, .16); color: #FDE68A; box-shadow: inset 0 0 0 1px rgba(251, 191, 36, .35); }
.pill.queue { background: rgba(255, 255, 255, .16); color: #fff; }
.pill.plan { color: rgba(255, 255, 255, .72); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .22); }

.bar-head { display: flex; justify-content: space-between; font-size: 12px; margin-top: 16px; opacity: .9; }
.bar-head b { font-variant-numeric: tabular-nums; }
.bar { height: 8px; background: rgba(255, 255, 255, .12); border-radius: 99px; margin-top: 8px; overflow: hidden; }
.bar > i {
  display: block; height: 100%; position: relative; overflow: hidden; border-radius: 99px;
  background: linear-gradient(90deg, #5EEAD4, #34D399, #10B981);
}
.bar > i::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .6), transparent);
  transform: translateX(-100%); animation: shimmer 2.4s 3s ease-in-out infinite;
}
@keyframes shimmer { 60%, 100% { transform: translateX(100%); } }
.hero-note { margin-top: 24px; opacity: .85; font-size: 14px; max-width: 360px; position: relative; z-index: 1; }

/* Suzuvchi kartochkalar */
.float-card {
  position: absolute; z-index: 3; pointer-events: none;
  background: var(--card); color: var(--heading); border: 1px solid var(--line);
  box-shadow: var(--shadow-lg);
}
.toast {
  left: -28px; bottom: -26px; display: flex; align-items: center; gap: 10px;
  padding: 10px 14px 10px 10px; border-radius: 16px;
  animation: popIn .8s 2.3s var(--ease-spring) both, bob 6s 3.1s ease-in-out infinite;
}
.toast b { display: block; font-size: 13px; line-height: 1.2; }
.toast span:not(.toast-ic) { font-size: 11.5px; color: var(--muted); }
.toast-ic {
  width: 32px; height: 32px; border-radius: 10px; display: grid; place-items: center;
  background: var(--icon-teal-bg); color: var(--teal); font-weight: 900;
}
.chip {
  right: -18px; top: -16px; display: flex; align-items: center; gap: 8px;
  padding: 8px 12px; border-radius: 999px; font-size: 12px; font-weight: 700;
  animation: popIn .8s 2.6s var(--ease-spring) both, bob 7s 3.4s ease-in-out infinite reverse;
}
.chip-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--grad); }
@keyframes popIn { from { opacity: 0; scale: .6; translate: 0 12px; } }
@keyframes bob { 50% { transform: translateY(-8px); } }

/* Pastga ko'rsatkich */
.scroll-cue { display: flex; justify-content: center; width: fit-content; margin: 48px auto 0; padding: 6px; border-radius: 999px; }
.mouse {
  width: 24px; height: 38px; border: 2px solid var(--line); border-radius: 14px;
  display: flex; justify-content: center; padding-top: 7px;
  transition: border-color .3s;
}
.mouse i { width: 3px; height: 7px; border-radius: 3px; background: var(--teal); animation: wheel 1.8s var(--ease) infinite; }
.scroll-cue:hover .mouse { border-color: var(--teal); }
@keyframes wheel { 0% { opacity: 0; transform: translateY(-3px); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(12px); } }

@media (max-width: 900px) {
  .hero { padding-top: 40px; }
  .hero-grid { grid-template-columns: 1fr; gap: 48px; }
  .stats { grid-template-columns: 1fr; }
  .hero-visual { transform: none; }
  .toast { left: 12px; bottom: -22px; }
  .chip { right: 12px; top: -16px; }
  .scroll-cue { display: none; }
}
</style>
