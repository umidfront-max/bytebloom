<script setup>
import { aboutCards } from '../data'

const ticks = ['Hujjatlashtirish', 'Ekspertiza', 'Joriy etish']
</script>

<template>
  <section id="biz" class="soft">
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
