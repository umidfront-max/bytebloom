<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { nav } from '../data'
import { useTheme } from '../composables/useTheme'
import BrandLockup from './brand/BrandLockup.vue'

const { theme, toggle } = useTheme()
const langs = ['UZ', 'RU', 'EN']
const lang = ref('UZ')
const scrolled = ref(false)
const progress = ref(0)
const menuOpen = ref(false)

// Scroll: holat + progress chizig'i (rAF bilan cheklangan)
let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const y = window.scrollY
    const max = document.documentElement.scrollHeight - innerHeight
    scrolled.value = y > 12
    progress.value = max > 0 ? Math.min(1, y / max) : 0
    ticking = false
  })
}

// Scroll-spy: qaysi bo'lim ekran markazida
const current = ref('')
const hovered = ref(null)
const menuEl = ref(null)
const ink = reactive({ x: 0, w: 0, on: false, snap: true })

function moveInk() {
  const href = hovered.value ?? current.value
  const a = href && menuEl.value?.querySelector(`a[href="${href}"]`)
  if (!a || innerWidth <= 900) { ink.on = false; return }
  // Birinchi ko'rinishda chapdan "uchib kelmasin" — joyida paydo bo'lsin
  ink.snap = !ink.on
  ink.x = a.offsetLeft
  ink.w = a.offsetWidth
  ink.on = true
  if (ink.snap) requestAnimationFrame(() => requestAnimationFrame(() => { ink.snap = false }))
}
watch([hovered, current], moveInk)

function onResize() {
  if (innerWidth > 900) menuOpen.value = false
  moveInk()
}
const onKey = (e) => { if (e.key === 'Escape') menuOpen.value = false }

let spy
onMounted(() => {
  onScroll()
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onResize)
  addEventListener('keydown', onKey)
  document.fonts?.ready.then(moveInk)

  spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) current.value = e.target.id === 'top' ? '' : `#${e.target.id}`
    })
  }, { rootMargin: '-45% 0px -50% 0px' })
  ;['#top', ...nav.map((n) => n.href)].forEach((h) => {
    const el = document.querySelector(h)
    if (el) spy.observe(el)
  })
})
onUnmounted(() => {
  removeEventListener('scroll', onScroll)
  removeEventListener('resize', onResize)
  removeEventListener('keydown', onKey)
  spy?.disconnect()
})
</script>

<template>
  <header :class="{ scrolled, 'menu-open': menuOpen }">
    <div class="wrap nav">
      <a class="logo" href="#top" aria-label="Bytebloom Technologies — bosh sahifa">
        <BrandLockup />
      </a>

      <nav ref="menuEl" class="menu" :class="{ open: menuOpen }" @mouseleave="hovered = null">
        <span class="ink" :class="{ on: ink.on, snap: ink.snap }" :style="{ transform: `translateX(${ink.x}px)`, width: `${ink.w}px` }"></span>
        <a
          v-for="(n, i) in nav" :key="n.href" :href="n.href"
          :class="{ active: current === n.href }"
          :aria-current="current === n.href ? 'true' : null"
          :style="{ '--i': i }"
          @mouseenter="hovered = n.href"
          @click="menuOpen = false"
        >{{ n.label }}</a>
      </nav>

      <div class="nav-right">
        <div class="langs" role="tablist" aria-label="Til">
          <span class="lang-pill" :style="{ transform: `translateX(${langs.indexOf(lang) * 38}px)` }"></span>
          <button
            v-for="l in langs" :key="l"
            role="tab" :aria-selected="lang === l"
            :class="{ on: lang === l }"
            @click="lang = l"
          >{{ l }}</button>
        </div>

        <button class="theme" :class="theme" :aria-label="theme === 'dark' ? 'Yorug‘ rejim' : 'Qorong‘i rejim'" @click="toggle">
          <span class="stars" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="knob">
            <Transition name="icon" mode="out-in">
              <svg v-if="theme === 'dark'" key="moon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
              <svg v-else key="sun" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
            </Transition>
          </span>
        </button>

        <a v-magnetic class="btn btn-primary cta" href="#aloqa">Konsultatsiya <span class="arr">→</span></a>

        <button class="burger" :class="{ open: menuOpen }" :aria-expanded="menuOpen" aria-label="Menyu" @click="menuOpen = !menuOpen">
          <i></i><i></i><i></i>
        </button>
      </div>
    </div>
    <span class="progress" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true"></span>
  </header>
</template>

<style scoped>
header {
  position: sticky; top: 0; z-index: 50;
  animation: dropIn .8s var(--ease) both;
}
/* Shisha fon alohida qatlamda — mobil menyuning o'z fonini buzmaydi */
header::before {
  content: ""; position: absolute; inset: 0; z-index: -1;
  background: var(--header-bg);
  backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5);
  border-bottom: 1px solid var(--line);
  box-shadow: 0 8px 30px rgba(15, 23, 42, .06);
  opacity: 0; transition: opacity .4s var(--ease);
}
header.scrolled::before, header.menu-open::before { opacity: 1; }
@keyframes dropIn { from { translate: 0 -18px; opacity: 0; } }

.nav { display: flex; align-items: center; justify-content: space-between; height: 76px; gap: 24px; transition: height .4s var(--ease); }
header.scrolled .nav { height: 64px; }

.logo {
  --logo-mark: var(--heading);
  --logo-text: var(--teal-dark);
  display: block; width: 96px; flex-shrink: 0;
  transition: width .4s var(--ease), transform .5s var(--ease-spring);
}
[data-theme="dark"] .logo { --logo-mark: #F1F5F9; --logo-text: #5EEAD4; }
header.scrolled .logo { width: 84px; }
.logo:hover { transform: scale(1.04); }

.menu { position: relative; display: flex; gap: 2px; color: var(--muted); font-weight: 600; font-size: 14px; }
.menu a { position: relative; z-index: 1; padding: 8px 14px; border-radius: 999px; transition: color .25s; }
.menu a:hover, .menu a.active { color: var(--heading); }
.ink {
  position: absolute; left: 0; top: 0; height: 100%; border-radius: 999px;
  background: var(--bg-soft); box-shadow: inset 0 0 0 1px var(--line);
  opacity: 0; pointer-events: none;
  transition: transform .5s var(--ease), width .5s var(--ease), opacity .3s;
}
.ink.on { opacity: 1; }
.ink.snap { transition: opacity .3s; }

.nav-right { display: flex; align-items: center; gap: 12px; }

.langs {
  position: relative; display: flex; padding: 3px;
  background: var(--bg-soft); border: 1px solid var(--line); border-radius: 999px;
  font-size: 12px; font-weight: 700;
}
.lang-pill {
  position: absolute; top: 3px; bottom: 3px; left: 3px; width: 38px; border-radius: 999px;
  background: var(--card); box-shadow: 0 2px 8px rgba(15, 23, 42, .1);
  transition: transform .45s var(--ease-spring), background-color .4s;
}
.langs button { position: relative; z-index: 1; width: 38px; padding: 6px 0; border: 0; background: transparent; border-radius: 999px; color: var(--muted); transition: color .25s; }
.langs button:hover, .langs button.on { color: var(--heading); }

.theme {
  width: 58px; height: 32px; padding: 0; position: relative; overflow: hidden;
  border-radius: 999px; border: 1px solid var(--line);
  background: linear-gradient(135deg, #E0F2FE, #EFF6FF);
  transition: border-color .3s, box-shadow .3s;
}
.theme.dark { background: linear-gradient(135deg, #0B1530, #1B2A55); }
.theme:hover { border-color: var(--card-hover-border); box-shadow: 0 0 0 4px rgba(13, 148, 136, .1); }
.stars i {
  position: absolute; width: 2px; height: 2px; border-radius: 50%; background: #fff;
  opacity: 0; transform: translateY(6px); transition: opacity .4s, transform .5s var(--ease);
}
.stars i:nth-child(1) { left: 12px; top: 9px; }
.stars i:nth-child(2) { left: 20px; top: 18px; width: 1.5px; height: 1.5px; transition-delay: .06s; }
.stars i:nth-child(3) { left: 9px; top: 21px; transition-delay: .12s; }
.theme.dark .stars i { opacity: .85; transform: none; }
.knob {
  position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%;
  background: #fff; color: #F59E0B; display: grid; place-items: center;
  box-shadow: 0 2px 8px rgba(15, 23, 42, .2);
  transition: transform .55s var(--ease-spring), background-color .3s, color .3s;
}
.theme.dark .knob { transform: translateX(26px); background: #2947A8; color: #FDE68A; }
.icon-enter-active, .icon-leave-active { transition: transform .25s var(--ease), opacity .2s; }
.icon-enter-from { transform: rotate(-90deg) scale(.4); opacity: 0; }
.icon-leave-to { transform: rotate(90deg) scale(.4); opacity: 0; }

.burger {
  display: none; width: 42px; height: 42px; border: 1px solid var(--line); background: var(--card);
  border-radius: 12px; flex-direction: column; justify-content: center; gap: 5px; align-items: center;
  transition: border-color .25s;
}
.burger i { display: block; width: 18px; height: 2px; background: var(--heading); border-radius: 2px; transition: transform .35s var(--ease), opacity .2s, width .3s var(--ease); }
.burger i:nth-child(2) { width: 12px; margin-left: 6px; }
.burger:hover i:nth-child(2) { width: 18px; margin-left: 0; }
.burger.open i:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger.open i:nth-child(2) { opacity: 0; transform: scaleX(0); }
.burger.open i:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.progress {
  position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
  background: linear-gradient(90deg, var(--teal), #34D399, #60A5FA);
  transform-origin: left; transform: scaleX(0); pointer-events: none;
}

@media (max-width: 900px) {
  .menu {
    position: absolute; left: 12px; right: 12px; top: calc(100% + 8px);
    flex-direction: column; gap: 2px; padding: 10px;
    background: var(--card); border: 1px solid var(--line); border-radius: 18px;
    box-shadow: var(--shadow-lg);
    transform: translateY(-10px) scale(.98); transform-origin: top center;
    opacity: 0; visibility: hidden;
    transition: transform .35s var(--ease), opacity .25s, visibility 0s .35s;
  }
  .menu.open { transform: none; opacity: 1; visibility: visible; transition: transform .4s var(--ease), opacity .25s, visibility 0s; }
  .menu a { padding: 12px 14px; font-size: 16px; border-radius: 12px; }
  .menu a:hover, .menu a.active { background: var(--bg-soft); }
  .menu.open a { animation: menuIn .45s var(--ease) both; animation-delay: calc(var(--i) * 45ms + 60ms); }
  .ink { display: none; }
  .cta, .langs { display: none; }
  .burger { display: flex; }
}
@keyframes menuIn { from { opacity: 0; translate: -10px 0; } }
</style>
