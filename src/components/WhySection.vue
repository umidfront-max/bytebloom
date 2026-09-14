<script setup>
import { advantages } from '../data'
import { useSectionFx } from '../composables/useSectionFx'
import NetworkField from './fx/NetworkField.vue'

const { el: section, hover, paused, pointer, onMove, onLeave } = useSectionFx()
</script>

<template>
  <section
    id="afzalliklar" ref="section"
    class="soft fx-sec" :class="{ hover, paused }"
    @pointermove="onMove" @pointerleave="onLeave"
  >
    <div class="fx-bg" aria-hidden="true">
      <span class="halo h1"></span>
      <span class="halo h2"></span>
      <NetworkField :paused="paused" :pointer="pointer" />
      <div class="fx-glow"></div>
    </div>

    <div class="wrap">
      <div class="sec-head" v-reveal>
        <span class="kicker">Afzalliklar</span>
        <h2>Nega Bytebloom</h2>
        <p>Davlat va korporativ loyihalardagi amaliy tajriba.</p>
      </div>
      <div class="cards">
        <article
          v-for="(a, i) in advantages" :key="a.title"
          v-reveal="(i % 3) * 90" v-spotlight
          class="card"
        >
          <div class="why-top">
            <div class="icon" :class="{ teal: i % 2 }">{{ String(i + 1).padStart(2, '0') }}</div>
            <span class="why-line"></span>
          </div>
          <h3>{{ a.title }}</h3>
          <p>{{ a.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.halo { position: absolute; border-radius: 50%; will-change: transform; }
.h1 {
  width: 540px; height: 540px; left: 50%; top: -220px; margin-left: -270px;
  background: radial-gradient(closest-side, var(--mesh-a), transparent);
  animation: breathe 9s ease-in-out infinite;
}
.h2 {
  width: 480px; height: 480px; right: -140px; bottom: -160px;
  background: radial-gradient(closest-side, var(--mesh-b), transparent);
  animation: breathe 12s ease-in-out -4s infinite;
}
@keyframes breathe { 50% { transform: scale(1.25); opacity: .6; } }

.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.why-top { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.why-top .icon { margin-bottom: 0; flex-shrink: 0; }
.why-line { position: relative; flex: 1; height: 1px; overflow: hidden; background: linear-gradient(90deg, var(--line), transparent); }
.why-line::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, var(--teal), #60A5FA 60%, transparent);
  transform: scaleX(0); transform-origin: left;
  transition: transform .7s var(--ease);
}
.card:hover .why-line::after { transform: scaleX(1); }
@media (max-width: 1024px) { .cards { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .cards { grid-template-columns: 1fr; } }
</style>
