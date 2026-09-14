<script setup>
import { services } from '../data'
</script>

<template>
  <section id="xizmatlar">
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
@media (max-width: 640px) { .cards { grid-template-columns: 1fr; } }
</style>
