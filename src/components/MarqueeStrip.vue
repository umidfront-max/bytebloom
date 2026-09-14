<script setup>
import { services } from '../data'

const items = [...services.map((s) => s.title), 'O‘zDST standartlari', 'ISO muvofiqligi', 'Davlat ekspertizasi']
</script>

<template>
  <div class="marquee" aria-hidden="true">
    <div class="track">
      <div v-for="n in 2" :key="n" class="group">
        <span v-for="t in items" :key="t" class="item"><i>✦</i>{{ t }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  position: relative; overflow: hidden; padding: 20px 0; margin-top: 24px;
  border-block: 1px solid var(--line);
  background: color-mix(in srgb, var(--card) 55%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.track { display: flex; width: max-content; animation: marquee 48s linear infinite; }
.marquee:hover .track { animation-play-state: paused; }
.group { display: flex; flex-shrink: 0; }
.item {
  display: inline-flex; align-items: center; gap: 16px; padding-inline: 20px;
  font-size: 15px; font-weight: 700; letter-spacing: -.01em; white-space: nowrap;
  color: var(--muted); transition: color .25s;
}
.item:hover { color: var(--heading); }
.item i { font-style: normal; font-size: 11px; color: var(--teal); }
@keyframes marquee { to { transform: translateX(-50%); } }
</style>
