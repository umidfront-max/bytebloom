<script setup>
import { contact } from '../data'
const year = new Date().getFullYear()

// Miltillovchi yulduzlar (deterministik psevdo-tasodif)
const stars = Array.from({ length: 42 }, (_, i) => {
  const r = (n) => ((Math.sin((i + 1) * n) * 43758.5453) % 1 + 1) % 1
  return {
    left: `${(r(12.9898) * 100).toFixed(2)}%`,
    top: `${(r(78.233) * 100).toFixed(2)}%`,
    size: `${(r(39.425) * 1.8 + 1).toFixed(1)}px`,
    dur: `${(r(11.135) * 3 + 2.5).toFixed(1)}s`,
    delay: `-${(r(63.7) * 5).toFixed(1)}s`,
  }
})
</script>

<template>
  <footer>
    <span class="glow-line" aria-hidden="true"></span>
    <div class="stars" aria-hidden="true">
      <i
        v-for="(s, i) in stars" :key="i"
        :style="{ left: s.left, top: s.top, width: s.size, height: s.size, '--dur': s.dur, '--delay': s.delay }"
      ></i>
    </div>
    <span class="foot-aura" aria-hidden="true"></span>
    <div class="wrap">
      <div class="foot">
        <div class="brand">
          <a class="logo" href="#top"><span class="mark">BT</span><h4>BYTEBLOOM TECHNOLOGIES</h4></a>
          <p>Axborot tizimlari uchun to‘liq sikl xizmatlari.</p>
        </div>
        <div>
          <h4>Sahifalar</h4>
          <a href="#xizmatlar">Xizmatlar</a>
          <a href="#jarayon">Jarayon</a>
          <a href="#biz">Kompaniya</a>
        </div>
        <div>
          <h4>Xizmatlar</h4>
          <a href="#xizmatlar">Hujjatlashtirish</a>
          <a href="#xizmatlar">Joriy etish</a>
          <a href="#xizmatlar">AX ekspertiza</a>
        </div>
        <div>
          <h4>Aloqa</h4>
          <a :href="contact.phoneHref">{{ contact.phone }}</a>
          <a :href="'mailto:' + contact.email">{{ contact.email }}</a>
        </div>
      </div>
      <div class="copy">
        <span>© {{ year }} BYTEBLOOM TECHNOLOGIES</span>
        <a class="to-top" href="#top">Yuqoriga <span>↑</span></a>
      </div>
      <div class="wordmark" aria-hidden="true">BYTEBLOOM</div>
    </div>
  </footer>
</template>

<style scoped>
footer { background: #12275F; color: #BFDBFE; padding: 56px 0 0; position: relative; z-index: 1; overflow: hidden; }
[data-theme="dark"] footer { background: #070D1A; }
.glow-line {
  position: absolute; left: 0; right: 0; top: 0; height: 1px;
  background: linear-gradient(90deg, transparent, #5EEAD4, #60A5FA, transparent);
  background-size: 200% 100%; animation: sweep 6s linear infinite; opacity: .7;
}
@keyframes sweep { from { background-position: 100% 0; } to { background-position: -100% 0; } }

.stars { position: absolute; inset: 0; pointer-events: none; }
.stars i {
  position: absolute; border-radius: 50%; background: #E0F2FE;
  box-shadow: 0 0 6px rgba(186, 230, 253, .9);
  opacity: .15; animation: twinkle var(--dur) ease-in-out var(--delay) infinite;
}
.stars i:nth-child(4n) { background: #5EEAD4; box-shadow: 0 0 8px rgba(94, 234, 212, .9); }
@keyframes twinkle { 50% { opacity: .9; transform: scale(1.4); } }
.foot-aura {
  position: absolute; left: 50%; bottom: -260px; width: 900px; height: 420px; margin-left: -450px;
  border-radius: 50%; pointer-events: none;
  background: radial-gradient(closest-side, rgba(45, 212, 191, .18), rgba(96, 165, 250, .08) 55%, transparent);
  animation: auraPulse 8s ease-in-out infinite;
}
@keyframes auraPulse { 50% { transform: scale(1.12); opacity: .7; } }
footer > .wrap { position: relative; z-index: 1; }

.foot { display: grid; grid-template-columns: 1.3fr 1fr 1fr 1fr; gap: 28px; }
footer h4 { color: #fff; margin-bottom: 14px; font-size: 15px; letter-spacing: -.01em; }
.logo { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; width: fit-content; }
.logo h4 { margin: 0; }
.mark {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: var(--grad); color: #fff; display: grid; place-items: center; font-size: 13px; font-weight: 800;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .2);
  transition: transform .5s var(--ease-spring);
}
.logo:hover .mark { transform: rotate(-8deg) scale(1.06); }
.brand p { max-width: 280px; }

.foot > div > a:not(.logo) {
  display: block; width: fit-content; margin: 8px 0; padding-bottom: 1px;
  background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
  transition: color .25s, background-size .35s var(--ease), transform .35s var(--ease);
}
.foot > div > a:not(.logo):hover { color: #fff; background-size: 100% 1px; transform: translateX(3px); }

.copy {
  margin-top: 36px; padding-top: 18px; border-top: 1px solid rgba(255, 255, 255, .12);
  display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;
  font-size: 13px;
}
.to-top {
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px 6px 14px; border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, .16); color: #DBEAFE; font-weight: 700;
  transition: background-color .3s, border-color .3s, color .2s;
}
.to-top span { display: inline-block; transition: transform .4s var(--ease-spring); }
.to-top:hover { background: rgba(255, 255, 255, .08); border-color: rgba(255, 255, 255, .3); color: #fff; }
.to-top:hover span { transform: translateY(-3px); }

.wordmark {
  margin-top: 20px; text-align: center; white-space: nowrap; user-select: none;
  font-size: clamp(56px, 13.5vw, 170px); font-weight: 800; letter-spacing: -.06em; line-height: .78;
  background: linear-gradient(100deg, rgba(255, 255, 255, .12) 0 40%, rgba(94, 234, 212, .55) 50%, rgba(255, 255, 255, .12) 60% 100%);
  background-size: 250% 100%;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  -webkit-mask-image: linear-gradient(180deg, #000 20%, transparent 90%);
  mask-image: linear-gradient(180deg, #000 20%, transparent 90%);
  animation: wordSweep 7s ease-in-out infinite;
  translate: 0 12%;
}
@keyframes wordSweep { 0%, 15% { background-position: 100% 0; } 65%, 100% { background-position: 0% 0; } }
@media (prefers-reduced-motion: reduce) { .wordmark { background-position: 50% 0; } }
@media (max-width: 900px) { .foot { grid-template-columns: 1fr 1fr; } .brand { grid-column: 1 / -1; } }
@media (max-width: 480px) { .foot { grid-template-columns: 1fr; } }
</style>
