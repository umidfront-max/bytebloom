<script setup>
import { services } from '../data'
import { useSectionFx } from '../composables/useSectionFx'

// Fon uchun "plata" chiziqlari (viewBox 1200×700). Har bir chiziq tugun (node) bilan tugaydi.
const traces = [
  { d: 'M-10 150 H140 L190 200 V300 L240 350 H420', node: [420, 350], dur: 6.5, delay: -1 },
  { d: 'M-10 520 H90 L140 470 V420 L190 370', node: [190, 370], dur: 5, delay: -3.2 },
  { d: 'M1210 120 H1060 L1010 170 V260 L960 310 H800', node: [800, 310], dur: 7, delay: -4.5 },
  { d: 'M1210 470 H1100 L1050 520 V620 L1000 670 H860', node: [860, 670], dur: 6, delay: -0.4 },
  { d: 'M380 710 V650 L430 600 H560 L600 560', node: [600, 560], dur: 5.5, delay: -2.1 },
  { d: 'M820 -10 V40 L780 80 H660', node: [660, 80], dur: 4.5, delay: -3.6 },
  { d: 'M300 -10 V70 L340 110 H470', node: [470, 110], dur: 5, delay: -1.7 },
]
// Impuls boshi chiziq oxiriga taxminan siklning 43% ida yetadi — tugun shu paytda chaqnaydi
const ARRIVE = 0.43

const { el: section, hover, paused, onMove, onLeave } = useSectionFx()
</script>

<template>
  <section
    id="xizmatlar" ref="section"
    class="fx-sec svc-sec" :class="{ hover, paused }"
    @pointermove="onMove" @pointerleave="onLeave"
  >
    <div class="fx-bg svc-bg" aria-hidden="true">
      <div class="dots"></div>
      <span class="blob b1"></span>
      <span class="blob b2"></span>
      <div class="fx-glow"></div>

      <svg class="circuit" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="svc-pulse" x1="0" y1="0" x2="1200" y2="700" gradientUnits="userSpaceOnUse">
            <stop class="fx-stop-a" offset="0" />
            <stop class="fx-stop-b" offset=".5" />
            <stop class="fx-stop-c" offset="1" />
          </linearGradient>
        </defs>

        <g class="traces">
          <path v-for="(t, i) in traces" :key="`t${i}`" :d="t.d" />
        </g>
        <g
          v-for="(t, i) in traces" :key="`p${i}`"
          class="pulse" :style="{ '--dur': `${t.dur}s`, '--delay': `${t.delay}s` }"
        >
          <path class="halo" :d="t.d" pathLength="100" />
          <path class="core" :d="t.d" pathLength="100" />
        </g>
        <g
          v-for="(t, i) in traces" :key="`n${i}`"
          class="node" :style="{ '--dur': `${t.dur}s`, '--delay': `${t.delay + t.dur * ARRIVE}s` }"
        >
          <circle class="ping" :cx="t.node[0]" :cy="t.node[1]" r="5" />
          <circle class="dot" :cx="t.node[0]" :cy="t.node[1]" r="4.5" />
        </g>
      </svg>
    </div>

    <div class="wrap">
      <div class="sec-head" v-reveal>
        <span class="kicker">Nima qilamiz</span>
        <h2>Xizmatlar</h2>
        <p>Axborot tizimining butun hayot sikli — bitta pudratchi bilan.</p>
      </div>
      <div class="cards">
        <article
          v-for="(s, i) in services" :key="s.title"
          v-reveal="(i % 3) * 90" v-spotlight
          class="card svc"
        >
          <span class="idx">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="icon" :class="{ teal: s.teal }">{{ s.icon }}</div>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
          <a class="more" href="#aloqa">Batafsil <span>→</span></a>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ---------- Animatsion fon ---------- */
.svc-sec { --trace: var(--fx-trace); --node-bg: var(--card); }
/* Chetlari ham ko'rinib tursin — kengroq niqob */
.svc-bg {
  -webkit-mask-image: radial-gradient(ellipse 95% 90% at 50% 50%, #000 60%, transparent 100%);
  mask-image: radial-gradient(ellipse 95% 90% at 50% 50%, #000 60%, transparent 100%);
}

.dots {
  position: absolute; inset: 0;
  background: radial-gradient(var(--fx-dot) 1.2px, transparent 1.6px) 0 0 / 24px 24px;
  animation: dotsDrift 40s linear infinite;
}
@keyframes dotsDrift { to { background-position: 24px 48px; } }

.blob { position: absolute; border-radius: 50%; will-change: transform; }
.b1 {
  width: 560px; height: 560px; left: -180px; top: 8%;
  background: radial-gradient(closest-side, var(--mesh-a), transparent);
  animation: blobA 18s ease-in-out infinite alternate;
}
.b2 {
  width: 620px; height: 620px; right: -200px; bottom: -12%;
  background: radial-gradient(closest-side, var(--mesh-b), transparent);
  animation: blobB 22s ease-in-out infinite alternate;
}
@keyframes blobA { to { transform: translate(260px, 120px) scale(1.2); } }
@keyframes blobB { to { transform: translate(-240px, -160px) scale(.9); } }

.circuit {
  position: absolute; inset: -20px; width: calc(100% + 40px); height: calc(100% + 40px);
  transform: translate3d(calc(var(--px, 0) * -18px), calc(var(--py, 0) * -12px), 0);
  transition: transform 1s var(--ease);
}
.traces path { fill: none; stroke: var(--trace); stroke-width: 1.5; stroke-linejoin: round; transition: stroke .4s; }

.pulse path {
  fill: none; stroke: url(#svc-pulse); stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 14 186; stroke-dashoffset: 200;
  animation: travel var(--dur) linear var(--delay) infinite;
}
.pulse .core { stroke-width: 2.6; }
.pulse .halo { stroke-width: 9; opacity: var(--fx-halo); }
@keyframes travel { to { stroke-dashoffset: 0; } }

.node .dot { fill: var(--node-bg); stroke: var(--trace); stroke-width: 1.8; animation: nodeFlash var(--dur) var(--ease) var(--delay) infinite; }
.node .ping {
  fill: none; stroke: var(--fx-pulse-a); stroke-width: 1.8; opacity: 0;
  transform-box: fill-box; transform-origin: center;
  animation: nodePing var(--dur) var(--ease) var(--delay) infinite;
}
@keyframes nodeFlash {
  0% { stroke: var(--fx-pulse-a); fill: var(--fx-pulse-a); }
  18%, 100% { stroke: var(--trace); fill: var(--node-bg); }
}
@keyframes nodePing {
  0% { transform: scale(1); opacity: .9; }
  22%, 100% { transform: scale(3.4); opacity: 0; }
}

/* ---------- Kartochkalar ---------- */
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.svc { display: flex; flex-direction: column; }
.svc p { flex: 1; }
.idx {
  position: absolute; top: 22px; right: 24px;
  font-size: 13px; font-weight: 800; letter-spacing: .06em; color: var(--muted); opacity: .4;
  transition: color .3s, opacity .3s, transform .4s var(--ease);
}
.svc:hover .idx { color: var(--teal); opacity: 1; transform: translateY(-2px); }
.more {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 16px; width: fit-content;
  color: var(--teal); font-weight: 700; font-size: 14px;
  background: linear-gradient(currentColor, currentColor) 0 100% / 0 1.5px no-repeat;
  padding-bottom: 2px; transition: background-size .35s var(--ease);
}
[data-theme="dark"] .more { color: #5EEAD4; }
.more span { transition: transform .35s var(--ease); }
.svc:hover .more span { transform: translateX(5px); }
.more:hover { background-size: 100% 1.5px; }

@media (max-width: 1024px) { .cards { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) {
  .cards { grid-template-columns: 1fr; }
  .circuit { opacity: .6; }
}
@media (prefers-reduced-motion: reduce) {
  .pulse, .node .ping { display: none; }
  .circuit { transition: none; transform: none; }
}
</style>
