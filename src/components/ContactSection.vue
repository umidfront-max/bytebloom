<script setup>
import { reactive, ref } from 'vue'
import { contact } from '../data'
import { useSectionFx } from '../composables/useSectionFx'

const { el: section, hover, paused, onMove, onLeave } = useSectionFx()

// Ko'tariluvchi zarrachalar — tasodifiy, lekin har renderda bir xil bo'lishi uchun oldindan hisoblangan
const particles = Array.from({ length: 28 }, (_, i) => {
  const r = (n) => ((Math.sin((i + 1) * n) * 10000) % 1 + 1) % 1
  return {
    left: `${(r(12.9898) * 100).toFixed(1)}%`,
    size: `${(r(78.233) * 3 + 2).toFixed(1)}px`,
    dur: `${(r(37.719) * 8 + 9).toFixed(1)}s`,
    delay: `-${(r(93.113) * 16).toFixed(1)}s`,
    drift: `${((r(4.321) - 0.5) * 80).toFixed(0)}px`,
  }
})

const serviceOptions = ['Loyiha-texnik hujjatlar', 'Kelishuv va ekspertiza', 'Tizim yaratish', 'AX hujjatlari', 'Texnik qo‘llab-quvvatlash']
const form = reactive({ name: '', phone: '', org: '', service: serviceOptions[0], message: '' })
const status = ref('idle') // idle | sending | sent

async function submit() {
  if (status.value !== 'idle') return
  status.value = 'sending'
  // TODO: real API'ga ulash. Hozircha 1.2s simulyatsiya.
  await new Promise((r) => setTimeout(r, 1200))
  status.value = 'sent'
  setTimeout(() => {
    Object.assign(form, { name: '', phone: '', org: '', service: serviceOptions[0], message: '' })
    status.value = 'idle'
  }, 3500)
}
</script>

<template>
  <section
    id="aloqa" ref="section"
    class="fx-sec" :class="{ hover, paused }"
    @pointermove="onMove" @pointerleave="onLeave"
  >
    <div class="fx-bg contact-bg" aria-hidden="true">
      <div class="fx-glow"></div>
      <span class="beam b1"></span>
      <span class="beam b2"></span>
      <div class="ripples"><i></i><i></i><i></i><i></i></div>
      <span
        v-for="(p, i) in particles" :key="i" class="particle"
        :style="{ left: p.left, width: p.size, height: p.size, '--dur': p.dur, '--delay': p.delay, '--drift': p.drift }"
      ></span>
    </div>

    <div class="wrap">
      <div class="sec-head" v-reveal>
        <span class="kicker">Aloqa</span>
        <h2>Loyihangizni muhokama qilamiz</h2>
        <p>Savolingiz yoki yangi g‘oyangiz bormi — mutaxassislarimiz yordam berishga tayyor.</p>
      </div>

      <div class="contact-grid">
        <div class="info-box" v-reveal.left>
          <span class="ring r1" aria-hidden="true"></span>
          <span class="ring r2" aria-hidden="true"></span>
          <h3>Bog‘laning</h3>
          <ul>
            <li>
              <a :href="contact.phoneHref" class="line">
                <span class="ic"><svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg></span>
                <span class="txt"><small>Telefon</small>{{ contact.phone }}</span>
              </a>
            </li>
            <li>
              <a :href="'mailto:' + contact.email" class="line">
                <span class="ic"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m22 7-10 6L2 7" /></svg></span>
                <span class="txt"><small>Email</small>{{ contact.email }}</span>
              </a>
            </li>
            <li>
              <div class="line">
                <span class="ic"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg></span>
                <span class="txt"><small>Sayt</small>{{ contact.site }}</span>
              </div>
            </li>
          </ul>
          <p>Savol yoki loyiha bormi? Ariza qoldiring — tez orada qaytamiz.</p>
        </div>

        <form v-reveal.right="120" @submit.prevent="submit">
          <h3>Ariza qoldirish</h3>
          <div class="two">
            <div class="field"><label for="f-name">Ism</label><input id="f-name" v-model="form.name" placeholder="Ismingiz" required /></div>
            <div class="field"><label for="f-phone">Telefon</label><input id="f-phone" v-model="form.phone" type="tel" placeholder="+998 __ ___ __ __" required /></div>
          </div>
          <div class="field">
            <label for="f-org">Tashkilot</label>
            <input id="f-org" v-model="form.org" placeholder="Kompaniya / tashkilot nomi" />
          </div>
          <div class="field">
            <label for="f-service">Xizmat turi</label>
            <select id="f-service" v-model="form.service">
              <option v-for="o in serviceOptions" :key="o">{{ o }}</option>
            </select>
          </div>
          <div class="field">
            <label for="f-msg">Xabar</label>
            <textarea id="f-msg" v-model="form.message" placeholder="Qisqacha loyiha haqida"></textarea>
          </div>
          <div class="actions">
            <button class="btn btn-teal" :class="{ sent: status === 'sent' }" type="submit" :disabled="status !== 'idle'">
              <Transition name="swap" mode="out-in">
                <span v-if="status === 'idle'" key="i" class="lbl">Yuborish <span class="arr">→</span></span>
                <span v-else-if="status === 'sending'" key="s" class="lbl"><i class="spin"></i> Yuborilmoqda…</span>
                <span v-else key="d" class="lbl">
                  <svg class="check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg> Yuborildi
                </span>
              </Transition>
            </button>
            <Transition name="note">
              <p v-if="status === 'sent'" class="ok-note" role="status">Rahmat! Arizangiz qabul qilindi — tez orada bog‘lanamiz.</p>
            </Transition>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Fon: signal to'lqinlari, nurlar, zarrachalar */
.contact-bg {
  -webkit-mask-image: radial-gradient(ellipse 90% 85% at 40% 60%, #000 40%, transparent 100%);
  mask-image: radial-gradient(ellipse 90% 85% at 40% 60%, #000 40%, transparent 100%);
}
.ripples {
  position: absolute; left: 50%; top: 58%; width: 0; height: 0;
  translate: calc(var(--px, 0) * -24px) calc(var(--py, 0) * -18px);
  transition: translate 1.2s var(--ease);
}
.ripples i {
  position: absolute; left: -720px; top: -720px; width: 1440px; height: 1440px; border-radius: 50%;
  border: 2px solid var(--fx-ring); opacity: 0;
  box-shadow: 0 0 40px var(--fx-beam), inset 0 0 40px var(--fx-beam);
  animation: ripple 10s cubic-bezier(.2, .6, .35, 1) infinite;
}
.ripples i:nth-child(2) { animation-delay: -2.5s; }
.ripples i:nth-child(3) { animation-delay: -5s; }
.ripples i:nth-child(4) { animation-delay: -7.5s; }
@keyframes ripple {
  0% { transform: scale(.06); opacity: 0; }
  8% { opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}

.beam {
  position: absolute; top: -40%; left: 0; width: 220px; height: 180%;
  background: linear-gradient(90deg, transparent, var(--fx-beam) 40%, var(--fx-beam) 60%, transparent);
  rotate: 18deg; opacity: 0;
  animation: sweepBeam 14s ease-in-out infinite;
}
.beam.b2 { width: 120px; animation-duration: 19s; animation-delay: -8s; }
@keyframes sweepBeam {
  0% { transform: translateX(-30vw); opacity: 0; }
  15%, 85% { opacity: 1; }
  100% { transform: translateX(120vw); opacity: 0; }
}

.particle {
  position: absolute; bottom: -10px; border-radius: 50%;
  background: var(--fx-pulse-a); box-shadow: 0 0 10px rgba(45, 212, 191, .8);
  opacity: 0;
  animation: rise var(--dur) linear var(--delay) infinite;
}
.particle:nth-child(3n) { background: var(--fx-pulse-b); box-shadow: 0 0 10px rgba(96, 165, 250, .8); }
@keyframes rise {
  0% { transform: translate(0, 0); opacity: 0; }
  12% { opacity: .9; }
  80% { opacity: .6; }
  100% { transform: translate(var(--drift), -900px); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .particle, .beam { display: none; }
}

.contact-grid { display: grid; grid-template-columns: .85fr 1.15fr; gap: 28px; align-items: stretch; }

.info-box {
  position: relative; overflow: hidden; isolation: isolate;
  background: linear-gradient(160deg, var(--navy), #1D4ED8 70%, #0E7490);
  color: #fff; border-radius: 24px; padding: 34px;
  box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, .15);
}
.info-box::before {
  content: ""; position: absolute; z-index: -1; width: 240px; height: 240px; right: -60px; top: -60px;
  background: radial-gradient(closest-side, rgba(16, 185, 129, .45), transparent);
  animation: drift 8s ease-in-out infinite;
}
@keyframes drift { 50% { transform: translate(-20px, 16px) scale(1.12); } }
.ring { position: absolute; z-index: -1; border-radius: 50%; border: 1px solid rgba(255, 255, 255, .12); pointer-events: none; }
.r1 { width: 280px; height: 280px; left: -90px; bottom: -120px; animation: breathe 7s ease-in-out infinite; }
.r2 { width: 180px; height: 180px; left: -40px; bottom: -70px; animation: breathe 7s ease-in-out -2.5s infinite; }
@keyframes breathe { 50% { transform: scale(1.08); opacity: .5; } }

.info-box h3 { font-size: 22px; margin-bottom: 18px; letter-spacing: -.02em; }
.info-box ul { list-style: none; display: grid; gap: 8px; }
.line {
  display: flex; align-items: center; gap: 14px; padding: 10px; margin-inline: -10px; border-radius: 14px;
  color: #DBEAFE; transition: background-color .3s, transform .35s var(--ease), color .2s;
}
a.line:hover { background: rgba(255, 255, 255, .08); transform: translateX(4px); color: #fff; }
.ic {
  width: 42px; height: 42px; flex-shrink: 0; border-radius: 12px; display: grid; place-items: center;
  background: rgba(255, 255, 255, .12); border: 1px solid rgba(255, 255, 255, .16);
  transition: background-color .3s, transform .45s var(--ease-spring);
}
.ic svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
a.line:hover .ic { background: #10B981; border-color: transparent; transform: rotate(-8deg) scale(1.05); color: #052e2b; }
.txt { display: flex; flex-direction: column; line-height: 1.3; font-weight: 700; }
.txt small { font-size: 11.5px; font-weight: 600; opacity: .7; letter-spacing: .02em; }
.info-box p { margin-top: 26px; color: #DBEAFE; }

form {
  background: var(--card); border-radius: 24px; padding: 30px;
  border: 1px solid var(--line); box-shadow: var(--shadow-sm);
}
form h3 { color: var(--heading); font-size: 20px; letter-spacing: -.02em; margin-bottom: 4px; }
.field { margin-top: 14px; }
label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 6px; color: var(--heading); transition: color .25s; }
.field:focus-within label { color: var(--teal); }
[data-theme="dark"] .field:focus-within label { color: #5EEAD4; }
input, select, textarea {
  width: 100%; border: 1px solid var(--line); border-radius: 12px;
  padding: 12px 14px; font: inherit; color: var(--text); background: var(--input-bg);
  transition: border-color .25s, box-shadow .3s var(--ease), background-color .25s;
}
input::placeholder, textarea::placeholder { color: var(--muted); opacity: .7; }
input:hover, select:hover, textarea:hover { border-color: var(--card-hover-border); }
input:focus, select:focus, textarea:focus {
  outline: none; border-color: var(--teal); background: var(--card);
  box-shadow: 0 0 0 4px rgba(13, 148, 136, .14);
}
select {
  appearance: none; -webkit-appearance: none; cursor: pointer; padding-right: 40px;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 6l4 4 4-4'/></svg>");
  background-repeat: no-repeat; background-position: right 14px center;
}
textarea { min-height: 100px; resize: vertical; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.two .field { margin-top: 14px; }

.actions { margin-top: 20px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.btn[disabled] { cursor: default; --lift: 0px; --press: 1; }
.btn.sent { background: var(--mint); }
.lbl { display: inline-flex; align-items: center; gap: 8px; }
.spin { width: 14px; height: 14px; border: 2px solid rgba(255, 255, 255, .4); border-top-color: #fff; border-radius: 50%; animation: rot .7s linear infinite; }
@keyframes rot { to { transform: rotate(360deg); } }
.check { width: 18px; height: 18px; fill: none; stroke: #fff; stroke-width: 2.8; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 22; stroke-dashoffset: 22; animation: draw .45s .15s var(--ease) forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }
.swap-enter-active, .swap-leave-active { transition: opacity .2s, transform .25s var(--ease); }
.swap-enter-from { opacity: 0; transform: translateY(8px); }
.swap-leave-to { opacity: 0; transform: translateY(-8px); }
.ok-note { font-size: 13.5px; font-weight: 600; color: var(--teal); }
[data-theme="dark"] .ok-note { color: #5EEAD4; }
.note-enter-active { transition: opacity .4s var(--ease), transform .4s var(--ease); }
.note-leave-active { transition: opacity .25s; }
.note-enter-from { opacity: 0; transform: translateX(-8px); }
.note-leave-to { opacity: 0; }

@media (max-width: 900px) { .contact-grid, .two { grid-template-columns: 1fr; } }
</style>
