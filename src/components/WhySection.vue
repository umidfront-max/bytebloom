<script setup>
import { advantages } from '../data'
</script>

<template>
  <section id="afzalliklar" class="soft">
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
