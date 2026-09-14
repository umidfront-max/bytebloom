<script setup>
import { ref } from 'vue'
import { steps } from '../data'

const active = ref(null)
const gridlines = [100, 75, 50, 25, 0]
</script>

<template>
  <section id="jarayon">
    <div class="wrap">
      <div class="sec-head" v-reveal>
        <span class="kicker">Qanday ishlaymiz</span>
        <h2>Loyiha jarayoni</h2>
        <p>Olti bosqich — qisqa va tushunarli. Har bir bosqich alohida kelishiladi.</p>
      </div>

      <div class="steps">
        <article
          v-for="(s, i) in steps" :key="s.title"
          v-reveal="(i % 3) * 90" v-spotlight
          class="step" :class="{ active: active === i }"
          @mouseenter="active = i" @mouseleave="active = null"
        >
          <div class="step-top">
            <div class="num">{{ i + 1 }}</div>
            <span class="step-load">yuklama {{ s.load }}%</span>
          </div>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
          <div class="step-bar"><i :style="{ width: `${s.load}%` }"></i></div>
        </article>
      </div>

      <div class="viz" v-reveal.scale>
        <div class="viz-head">
          <h3>Bosqichlar yuklamasi — vizual</h3>
          <Transition name="hint" mode="out-in">
            <span :key="active ?? 'none'" class="viz-hint" :class="{ on: active !== null }">
              {{ active === null ? 'Ustunga kursorni olib boring' : `${active + 1}. ${steps[active].title}` }}
            </span>
          </Transition>
        </div>

        <div class="chart-area">
          <div class="gridlines" aria-hidden="true">
            <div v-for="g in gridlines" :key="g" class="gl"><em>{{ g }}</em></div>
          </div>
          <div class="chart">
            <div
              v-for="(s, i) in steps" :key="i"
              class="slot" :class="{ hot: active === i, dim: active !== null && active !== i }"
              :style="{ '--h': `${s.load}%`, '--d': `${i * 90}ms` }"
              @mouseenter="active = i" @mouseleave="active = null"
            >
              <span class="val">{{ s.load }}%</span>
              <div class="col"></div>
            </div>
          </div>
        </div>
        <div class="chart-labels">
          <span v-for="(s, i) in steps" :key="i" :class="{ hot: active === i }">{{ i + 1 }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.step {
  background: var(--card); border-radius: var(--radius); padding: 24px; border: 1px solid var(--line);
  box-shadow: var(--shadow-xs);
  transition: transform .4s var(--ease), box-shadow .4s var(--ease), border-color .3s, background-color .4s;
}
.step.active { transform: translateY(-6px); box-shadow: var(--shadow); border-color: var(--card-hover-border); }
.step-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.num {
  position: relative; width: 40px; height: 40px; border-radius: 50%;
  background: var(--navy); color: #fff; display: grid; place-items: center; font-weight: 800;
  transition: background-color .35s, transform .5s var(--ease-spring);
}
[data-theme="dark"] .num { background: #2947A8; }
.num::after {
  content: ""; position: absolute; inset: -6px; border-radius: 50%;
  border: 1.5px dashed var(--teal); opacity: 0; transition: opacity .3s;
}
.step.active .num { background: var(--teal); transform: scale(1.08); }
.step.active .num::after { opacity: .8; animation: spin 10s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.step-load { font-size: 12px; font-weight: 700; color: var(--muted); transition: color .3s; }
.step.active .step-load { color: var(--teal); }
.step h3 { font-size: 16.5px; margin-bottom: 6px; color: var(--heading); }
.step p { color: var(--muted); font-size: 14px; }
.step-bar { margin-top: 18px; height: 4px; border-radius: 99px; background: var(--line); overflow: hidden; }
.step-bar i {
  display: block; height: 100%; border-radius: inherit;
  background: linear-gradient(90deg, var(--navy), var(--teal));
  transform: scaleX(0); transform-origin: left;
  transition: transform 1s var(--ease) .35s;
}
.step.is-visible .step-bar i { transform: scaleX(1); }

/* Grafik */
.viz {
  margin-top: 32px; padding: 24px 24px 18px; border-radius: 22px;
  background: var(--card); border: 1px solid var(--line); box-shadow: var(--shadow-xs);
}
.viz-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.viz h3 { font-size: 16px; color: var(--heading); }
.viz-hint {
  font-size: 12.5px; font-weight: 700; color: var(--muted);
  padding: 5px 12px; border-radius: 999px; background: var(--bg-soft); border: 1px solid var(--line);
}
.viz-hint.on { color: var(--eyebrow-text); background: var(--eyebrow-bg); border-color: rgba(13, 148, 136, .25); }
.hint-enter-active, .hint-leave-active { transition: opacity .18s, transform .18s var(--ease); }
.hint-enter-from { opacity: 0; transform: translateY(4px); }
.hint-leave-to { opacity: 0; transform: translateY(-4px); }

.chart-area { position: relative; height: 180px; margin: 30px 0 0 32px; }
.gridlines { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; pointer-events: none; }
.gl { position: relative; height: 0; border-top: 1px dashed var(--line); }
.gl:last-child { border-top-style: solid; }
.gl em { position: absolute; right: calc(100% + 10px); top: -7px; font-style: normal; font-size: 11px; line-height: 1; color: var(--muted); font-variant-numeric: tabular-nums; }

.chart { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; padding-inline: 10px; }
.slot { position: relative; height: 100%; cursor: pointer; }
.col {
  position: absolute; left: 0; right: 0; bottom: 0; height: var(--h);
  border-radius: 10px 10px 4px 4px; overflow: hidden;
  background: linear-gradient(180deg, #60A5FA, #1E3A8A);
  transform-origin: bottom;
  transition: filter .3s, opacity .35s, box-shadow .35s var(--ease), transform .4s var(--ease);
}
.col::before {
  content: ""; position: absolute; inset: 0 0 auto; height: 45%;
  background: linear-gradient(180deg, rgba(255, 255, 255, .32), transparent);
}
.slot:nth-child(odd) .col { background: linear-gradient(180deg, #5EEAD4, #0D9488); }
.viz.is-visible .col { animation: grow 1.1s var(--ease) var(--d) both; }
@keyframes grow { from { scale: 1 0; } }
.slot.hot .col { filter: brightness(1.1) saturate(1.15); transform: scaleY(1.03); box-shadow: 0 14px 28px rgba(13, 148, 136, .28); }
.slot.dim .col { opacity: .4; }

.val {
  position: absolute; left: 0; right: 0; bottom: calc(var(--h) + 8px); text-align: center;
  font-size: 12px; font-weight: 800; color: var(--muted); font-variant-numeric: tabular-nums;
  transition: color .3s, transform .4s var(--ease-spring);
}
.viz.is-visible .val { animation: valIn .5s var(--ease) calc(var(--d) + .8s) both; }
@keyframes valIn { from { opacity: 0; translate: 0 6px; } }
.slot.hot .val { color: var(--heading); transform: translateY(-4px) scale(1.12); }

.chart-labels {
  display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px;
  margin: 10px 0 0 32px; padding-inline: 10px;
  color: var(--muted); font-size: 12px; font-weight: 700; text-align: center;
}
.chart-labels span { transition: color .3s; }
.chart-labels span.hot { color: var(--teal); }

@media (max-width: 1024px) { .steps { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) {
  .steps { grid-template-columns: 1fr; }
  .chart, .chart-labels { gap: 8px; padding-inline: 4px; }
}
</style>
