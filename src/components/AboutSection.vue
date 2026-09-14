<script setup>
import { aboutCards } from '../data'
import { useSectionFx } from '../composables/useSectionFx'

const ticks = ['Hujjatlashtirish', 'Ekspertiza', 'Joriy etish']
const { el: section, hover, paused, onMove, onLeave } = useSectionFx()
</script>

<template>
  <section
    id="biz" ref="section"
    class="soft fx-sec" :class="{ hover, paused }"
    @pointermove="onMove" @pointerleave="onLeave"
  >
    <div class="fx-bg about-bg" aria-hidden="true">
      <div class="fx-glow"></div>
      <div class="system">
        <div class="plane">
          <div class="radar"></div>
          <div class="orbit o4"><i class="planet"></i></div>
          <div class="orbit o3"><i class="planet blue"></i><i class="planet small opposite"></i></div>
          <div class="orbit o2"><i class="planet"></i></div>
          <div class="orbit o1"><i class="planet blue small"></i></div>
          <div class="core"></div>
        </div>
      </div>
    </div>

    <div class="wrap about">
      <div class="about-copy" v-reveal.left>
        <span class="kicker">Kompaniya</span>
        <h2>Biz haqimizda</h2>
        <p>MChJ «BYTEBLOOM TECHNOLOGIES» 2022-yilda tashkil etilgan. Biz O‘zbekiston bo‘ylab axborot tizimlarini hujjatlashtirish, yaratish, ekspertizadan o‘tkazish va joriy etish bilan shug‘ullanamiz.</p>
        <ul class="ticks">
          <li v-for="t in ticks" :key="t">
            <span class="tick"><svg viewBox="0 0 16 16"><path d="M4 8.5l2.5 2.5L12 5.5" /></svg></span>{{ t }}
          </li>
        </ul>
        <a v-magnetic class="btn btn-primary" href="#aloqa">Hamkorlikni boshlash <span class="arr">→</span></a>
      </div>
      <div class="mini">
        <article
          v-for="(c, i) in aboutCards" :key="c.title"
          v-reveal.scale="i * 90" v-spotlight
          class="card"
        >
          <span class="mini-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3>{{ c.title }}</h3>
          <p>{{ c.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Fon: orbitalar tizimi */
.about-bg {
  -webkit-mask-image: radial-gradient(ellipse 90% 90% at 70% 50%, #000 40%, transparent 100%);
  mask-image: radial-gradient(ellipse 90% 90% at 70% 50%, #000 40%, transparent 100%);
}
.system {
  position: absolute; width: 920px; height: 920px; left: 72%; top: 50%;
  margin: -460px 0 0 -460px;
  transform: translate3d(calc(var(--px, 0) * -26px), calc(var(--py, 0) * -20px), 0);
  transition: transform 1.2s var(--ease);
}
.plane { position: absolute; inset: 0; transform: perspective(1400px) rotateX(62deg) rotateZ(-18deg); }
.orbit {
  position: absolute; inset: var(--inset); border-radius: 50%;
  border: 1.5px solid var(--fx-line);
  animation: spin var(--dur) linear infinite;
}
[data-theme="dark"] .orbit { border-width: 1px; }
.o1 { --inset: 330px; --dur: 14s; }
.o2 { --inset: 230px; --dur: 24s; border-style: dashed; animation-direction: reverse; }
.o3 { --inset: 120px; --dur: 38s; }
.o4 { --inset: 0px; --dur: 60s; border-style: dashed; animation-direction: reverse; }
@keyframes spin { to { transform: rotate(360deg); } }

.planet {
  position: absolute; top: -6px; left: 50%; width: 12px; height: 12px; margin-left: -6px; border-radius: 50%;
  background: var(--fx-pulse-a);
  box-shadow: 0 0 0 5px rgba(45, 212, 191, .18), 0 0 22px rgba(45, 212, 191, .75);
}
.planet.blue { background: var(--fx-pulse-b); box-shadow: 0 0 0 5px rgba(96, 165, 250, .18), 0 0 22px rgba(96, 165, 250, .75); }
.planet.small { width: 8px; height: 8px; margin-left: -4px; top: -4px; }
.planet.opposite { top: auto; bottom: -4px; }

.radar {
  position: absolute; inset: 0; border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0deg 250deg, rgba(45, 212, 191, .08) 330deg, rgba(45, 212, 191, .2) 360deg);
  -webkit-mask-image: radial-gradient(closest-side, transparent 10%, #000 22%, #000 50%, transparent 100%);
  mask-image: radial-gradient(closest-side, transparent 10%, #000 22%, #000 50%, transparent 100%);
  animation: spin 9s linear infinite;
}
.core {
  position: absolute; left: 50%; top: 50%; width: 150px; height: 150px; margin: -75px 0 0 -75px; border-radius: 50%;
  background: radial-gradient(closest-side, rgba(45, 212, 191, .4), rgba(96, 165, 250, .12) 60%, transparent);
  animation: corePulse 4.5s ease-in-out infinite;
}
:root:not([data-theme="dark"]) .radar {
  background: conic-gradient(from 0deg, transparent 0deg 250deg, rgba(13, 148, 136, .1) 330deg, rgba(13, 148, 136, .26) 360deg);
}
@keyframes corePulse { 50% { transform: scale(1.25); opacity: .65; } }

@media (max-width: 900px) {
  .system { left: 50%; top: 72%; scale: .7; }
}
@media (prefers-reduced-motion: reduce) {
  .system { transition: none; transform: none; }
}

.about { display: grid; grid-template-columns: 1.1fr .9fr; gap: 48px; align-items: center; }
.about-copy > p { color: var(--muted); margin: 16px 0 22px; font-size: 16px; max-width: 560px; }
.ticks { list-style: none; display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 30px; }
.ticks li {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 7px 14px 7px 8px; border-radius: 999px;
  background: var(--card); border: 1px solid var(--line); box-shadow: var(--shadow-xs);
  font-size: 13.5px; font-weight: 700; color: var(--heading);
  transition: transform .35s var(--ease), border-color .3s, box-shadow .35s var(--ease);
}
.ticks li:hover { transform: translateY(-2px); border-color: var(--card-hover-border); box-shadow: var(--shadow-sm); }
.tick { width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; background: var(--teal); }
.tick svg { width: 12px; height: 12px; fill: none; stroke: #fff; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }

.mini { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.mini .card { padding: 20px; }
.mini-num {
  display: inline-block; margin-bottom: 12px;
  font-size: 12px; font-weight: 800; letter-spacing: .08em;
  background: var(--grad); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
[data-theme="dark"] .mini-num { background: linear-gradient(135deg, #93C5FD, #5EEAD4); -webkit-background-clip: text; background-clip: text; }
.mini .card h3 { font-size: 16.5px; }
@media (max-width: 900px) { .about { grid-template-columns: 1fr; gap: 36px; } }
@media (max-width: 480px) { .mini { grid-template-columns: 1fr; } }
</style>
