<script setup>
import { ref, nextTick, watch, computed, onMounted, onUnmounted } from 'vue'
import { services } from '../data'

const open = ref(false)
const input = ref('')
const typing = ref(false)
const unread = ref(1)
const hint = ref(false)
const listEl = ref(null)
const inputEl = ref(null)

const now = () => new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })

const messages = ref([
  { id: 1, from: 'bot', text: 'Assalomu aleykum! Qanday produktlarimiz sizni qiziqtirmoqda?', time: now() },
])

// Tezkor javob chiplari — xizmatlar ro'yxatidan
const quick = computed(() => services.map((s) => s.title))
const showQuick = computed(() => messages.value.length === 1)

let seq = 2
const scrollDown = () => nextTick(() => { if (listEl.value) listEl.value.scrollTop = listEl.value.scrollHeight })

function botReply(userText) {
  typing.value = true
  scrollDown()
  const t = userText.toLowerCase()
  const match = services.find((s) => t.includes(s.title.toLowerCase().split(' ')[0]))
  const text = match
    ? `«${match.title}» bo‘yicha ma’lumot: ${match.text} Batafsil maslahat uchun telefon raqamingizni qoldiring — mutaxassis bog‘lanadi.`
    : 'Rahmat! Savolingizni qabul qildik. Aniq javob uchun +998 97 414 77 78 raqamiga qo‘ng‘iroq qiling yoki shu yerda telefoningizni qoldiring.'
  setTimeout(() => {
    typing.value = false
    messages.value.push({ id: seq++, from: 'bot', text, time: now() })
    if (!open.value) unread.value++
    scrollDown()
  }, 900 + Math.random() * 600)
}

function send(text = input.value) {
  const clean = text.trim()
  if (!clean) return
  messages.value.push({ id: seq++, from: 'user', text: clean, time: now() })
  input.value = ''
  scrollDown()
  botReply(clean)
}

function toggle() {
  open.value = !open.value
  hint.value = false
  if (open.value) {
    unread.value = 0
    scrollDown()
    nextTick(() => inputEl.value?.focus())
  }
}

watch(open, (v) => { if (v) scrollDown() })

let hintTimer
const onKey = (e) => { if (e.key === 'Escape' && open.value) toggle() }
onMounted(() => {
  hintTimer = setTimeout(() => { if (!open.value) hint.value = true }, 5000)
  addEventListener('keydown', onKey)
})
onUnmounted(() => {
  clearTimeout(hintTimer)
  removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="chat-root">
    <Transition name="panel">
      <div v-if="open" class="panel" role="dialog" aria-label="Bytebloom chat">
        <div class="head">
          <div class="avatar">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="8" width="16" height="12" rx="4"/><circle cx="9" cy="14" r="1.2" fill="currentColor"/><circle cx="15" cy="14" r="1.2" fill="currentColor"/><path d="M12 8V4M9 4h6"/>
            </svg>
            <i class="online"></i>
          </div>
          <div class="who">
            <b>BYTEBLOOM</b>
            <span>Onlayn · odatda 1 daqiqada javob beradi</span>
          </div>
          <button class="close" aria-label="Yopish" @click="toggle">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        <div class="list" ref="listEl">
          <div class="day">Bugun</div>
          <TransitionGroup name="msg">
            <div v-for="m in messages" :key="m.id" class="msg" :class="m.from">
              <div class="bubble">
                <div v-if="m.from === 'bot'" class="tag">BYTEBLOOM <em>Bot</em></div>
                <p>{{ m.text }}</p>
                <time>{{ m.time }}</time>
              </div>
            </div>
          </TransitionGroup>

          <Transition name="msg">
            <div v-if="typing" class="msg bot">
              <div class="bubble typing"><i></i><i></i><i></i></div>
            </div>
          </Transition>

          <Transition name="fade">
            <div v-if="showQuick && !typing" class="quick">
              <button v-for="(q, i) in quick" :key="q" :style="{ '--i': i }" @click="send(q)">{{ q }}</button>
            </div>
          </Transition>
        </div>

        <form class="compose" @submit.prevent="send()">
          <input ref="inputEl" v-model="input" placeholder="Xabar yozing…" autocomplete="off" />
          <button type="submit" class="send" :disabled="!input.trim()" aria-label="Yuborish">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </button>
        </form>
      </div>
    </Transition>

    <Transition name="hint">
      <div v-if="hint && !open" class="hint" @click="toggle">
        <span class="wave" aria-hidden="true">👋</span>
        <div><b>Savolingiz bormi?</b><span>Biz onlaynmiz — yozing!</span></div>
        <button class="hint-x" aria-label="Yopish" @click.stop="hint = false">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
    </Transition>

    <button class="fab" :class="{ open }" :aria-label="open ? 'Chatni yopish' : 'Chatni ochish'" :aria-expanded="open" @click="toggle">
      <Transition name="swap" mode="out-in">
        <svg v-if="!open" key="c" class="fab-ic" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/></svg>
        <svg v-else key="x" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </Transition>
      <Transition name="pop">
        <span v-if="unread && !open" class="badge">{{ unread }}</span>
      </Transition>
      <span v-if="!open" class="ring"></span>
    </button>
  </div>
</template>

<style scoped>
.chat-root { position: fixed; right: 20px; bottom: 20px; z-index: 90; display: flex; flex-direction: column; align-items: flex-end; gap: 14px; }

/* FAB */
.fab {
  width: 60px; height: 60px; border-radius: 50%; border: 0; position: relative;
  background: var(--grad); color: #fff;
  display: grid; place-items: center;
  box-shadow: 0 14px 34px rgba(13, 148, 136, .4), inset 0 1px 0 rgba(255, 255, 255, .25);
  transition: transform .45s var(--ease-spring), box-shadow .35s var(--ease), background-color .3s;
  animation: fabIn .8s 1.4s var(--ease-spring) both;
}
@keyframes fabIn { from { scale: 0; rotate: -60deg; opacity: 0; } }
.fab:hover { transform: translateY(-3px) scale(1.06); box-shadow: 0 18px 40px rgba(13, 148, 136, .5), inset 0 1px 0 rgba(255, 255, 255, .25); }
.fab:active { transform: scale(.94); transition-duration: .12s; }
.fab:hover .fab-ic { animation: wiggle .6s var(--ease); }
@keyframes wiggle { 20% { rotate: -14deg; } 45% { rotate: 10deg; } 70% { rotate: -5deg; } }
.fab.open { background: var(--card); color: var(--heading); box-shadow: var(--shadow), inset 0 0 0 1px var(--line); }
.ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--mint); animation: ring 2.4s var(--ease) infinite; pointer-events: none; }
@keyframes ring { from { transform: scale(1); opacity: .7; } to { transform: scale(1.7); opacity: 0; } }
.badge {
  position: absolute; top: -4px; right: -4px; min-width: 22px; height: 22px; padding: 0 6px;
  border-radius: 999px; background: #EF4444; color: #fff; font-size: 12px; font-weight: 800;
  display: grid; place-items: center; border: 2px solid var(--bg);
  box-shadow: 0 4px 10px rgba(239, 68, 68, .4);
}

/* Salomlashish pufagi */
.hint {
  position: relative; display: flex; align-items: center; gap: 12px; cursor: pointer;
  padding: 12px 38px 12px 14px; margin-right: 6px; border-radius: 18px 18px 6px 18px;
  background: var(--card); border: 1px solid var(--line); box-shadow: var(--shadow-lg);
  transform-origin: bottom right;
  transition: transform .3s var(--ease), border-color .3s;
}
.hint:hover { transform: translateY(-2px); border-color: var(--card-hover-border); }
.hint b { display: block; font-size: 14px; color: var(--heading); line-height: 1.25; }
.hint span:not(.wave) { font-size: 12.5px; color: var(--muted); }
.wave { font-size: 22px; display: inline-block; transform-origin: 70% 80%; animation: wave 2.2s .5s ease-in-out infinite; }
@keyframes wave { 0%, 60%, 100% { transform: rotate(0); } 10%, 30% { transform: rotate(16deg); } 20%, 40% { transform: rotate(-10deg); } }
.hint-x {
  position: absolute; top: 8px; right: 8px; width: 22px; height: 22px; border: 0; border-radius: 50%;
  display: grid; place-items: center; background: var(--bg-soft); color: var(--muted);
  transition: background-color .2s, color .2s, transform .3s var(--ease);
}
.hint-x:hover { background: var(--line); color: var(--heading); transform: rotate(90deg); }
.hint-enter-active { transition: opacity .4s var(--ease), transform .6s var(--ease-spring); }
.hint-leave-active { transition: opacity .2s, transform .25s ease-in; }
.hint-enter-from, .hint-leave-to { opacity: 0; transform: translateY(10px) scale(.85); }

/* Panel */
.panel {
  width: min(370px, calc(100vw - 40px)); height: min(580px, calc(100dvh - 120px));
  background: var(--card); border: 1px solid var(--line); border-radius: 24px;
  box-shadow: var(--shadow-lg); overflow: hidden; display: flex; flex-direction: column;
  transform-origin: bottom right;
}
.head {
  display: flex; align-items: center; gap: 12px; padding: 14px 16px;
  background: var(--grad); color: #fff;
  position: relative; overflow: hidden;
}
.head::before {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, .18) 50%, transparent 70%);
  transform: translateX(-100%); animation: sheen 5s 1s ease-in-out infinite;
}
@keyframes sheen { 40%, 100% { transform: translateX(100%); } }
.head::after { content: ""; position: absolute; right: -30px; top: -40px; width: 120px; height: 120px; border-radius: 50%; background: rgba(255, 255, 255, .12); }
.avatar { position: relative; width: 42px; height: 42px; flex-shrink: 0; border-radius: 50%; background: rgba(255, 255, 255, .18); display: grid; place-items: center; border: 2px solid rgba(255, 255, 255, .35); }
.online { position: absolute; right: -1px; bottom: -1px; width: 12px; height: 12px; border-radius: 50%; background: #34D399; border: 2px solid #1a5f87; }
.online::after { content: ""; position: absolute; inset: -2px; border-radius: 50%; background: #34D399; animation: ping 1.8s var(--ease) infinite; }
@keyframes ping { from { transform: scale(1); opacity: .7; } to { transform: scale(2.4); opacity: 0; } }
.who { display: flex; flex-direction: column; line-height: 1.25; position: relative; z-index: 1; }
.who b { font-size: 15px; letter-spacing: -.01em; }
.who span { font-size: 11.5px; opacity: .88; }
.close {
  margin-left: auto; width: 34px; height: 34px; border-radius: 50%; border: 0; position: relative; z-index: 1;
  background: rgba(255, 255, 255, .16); color: #fff; display: grid; place-items: center;
  transition: background-color .2s, transform .35s var(--ease);
}
.close:hover { background: rgba(255, 255, 255, .3); transform: rotate(90deg); }

.list { flex: 1; overflow-y: auto; padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 10px; background: var(--bg); scroll-behavior: smooth; overscroll-behavior: contain; }
.day { align-self: center; font-size: 11px; font-weight: 700; color: var(--muted); background: var(--card); border: 1px solid var(--line); border-radius: 999px; padding: 2px 10px; }
.msg { display: flex; transform-origin: bottom left; }
.msg.user { justify-content: flex-end; transform-origin: bottom right; }
.bubble {
  max-width: 82%; padding: 10px 12px 8px; border-radius: 18px; font-size: 14px; line-height: 1.5;
  background: var(--card); border: 1px solid var(--line); color: var(--text);
  border-bottom-left-radius: 6px; position: relative; box-shadow: var(--shadow-xs);
}
.msg.user .bubble {
  background: linear-gradient(135deg, var(--navy), #2947A8); color: #fff; border-color: transparent;
  border-bottom-left-radius: 18px; border-bottom-right-radius: 6px;
  box-shadow: 0 6px 16px rgba(30, 58, 138, .22);
}
[data-theme="dark"] .msg.user .bubble { background: linear-gradient(135deg, #2947A8, #3557C7); }
.tag { font-size: 11px; color: var(--muted); font-weight: 700; margin-bottom: 4px; display: flex; gap: 6px; align-items: center; }
.tag em { font-style: normal; background: var(--icon-bg); color: var(--navy); border-radius: 999px; padding: 1px 7px; font-size: 10px; }
[data-theme="dark"] .tag em { color: #93C5FD; }
.bubble p { white-space: pre-wrap; }
.bubble time { display: block; text-align: right; font-size: 10.5px; opacity: .6; margin-top: 4px; }
.typing { display: flex; gap: 5px; padding: 13px 14px; }
.typing i { width: 7px; height: 7px; border-radius: 50%; background: var(--muted); animation: bounce 1.2s infinite; }
.typing i:nth-child(2) { animation-delay: .15s; }
.typing i:nth-child(3) { animation-delay: .3s; }
@keyframes bounce { 0%, 60%, 100% { transform: none; opacity: .45; } 30% { transform: translateY(-5px); opacity: 1; } }

.quick { display: flex; flex-wrap: wrap; gap: 6px; padding-top: 4px; }
.quick button {
  border: 1px solid rgba(13, 148, 136, .45); background: var(--icon-teal-bg); color: var(--teal-dark);
  border-radius: 999px; padding: 6px 11px; font-size: 12px; font-weight: 700;
  transition: background-color .2s, color .2s, transform .3s var(--ease), box-shadow .3s var(--ease);
  animation: chipIn .45s var(--ease-spring) both; animation-delay: calc(var(--i) * 55ms + .35s);
}
@keyframes chipIn { from { opacity: 0; scale: .8; translate: 0 6px; } }
[data-theme="dark"] .quick button { color: #5EEAD4; }
.quick button:hover { background: var(--teal); color: #fff; transform: translateY(-2px); box-shadow: 0 6px 14px rgba(13, 148, 136, .3); }

.compose { display: flex; gap: 8px; padding: 12px; border-top: 1px solid var(--line); background: var(--card); }
.compose input { flex: 1; min-width: 0; border: 1px solid var(--line); border-radius: 999px; padding: 11px 16px; font: inherit; background: var(--input-bg); color: var(--text); transition: border-color .2s, box-shadow .3s var(--ease); }
.compose input:focus { outline: none; border-color: var(--teal); box-shadow: 0 0 0 4px rgba(13, 148, 136, .15); }
.send { width: 42px; height: 42px; flex-shrink: 0; border-radius: 50%; border: 0; background: var(--teal); color: #fff; display: grid; place-items: center; transition: background-color .25s, color .25s, transform .4s var(--ease-spring), box-shadow .3s; }
.send svg { transition: transform .3s var(--ease); }
.send:disabled { background: var(--line); color: var(--muted); cursor: default; }
.send:not(:disabled):hover { transform: scale(1.08); box-shadow: 0 8px 18px rgba(13, 148, 136, .35); }
.send:not(:disabled):hover svg { transform: translateY(-2px); }
.send:not(:disabled):active { transform: scale(.94); }

/* Transitionlar */
.panel-enter-active { transition: transform .55s var(--ease-spring), opacity .3s, filter .4s; }
.panel-leave-active { transition: transform .3s ease-in, opacity .25s, filter .25s; }
.panel-enter-from, .panel-leave-to { transform: translateY(24px) scale(.88); opacity: 0; filter: blur(6px); }
.msg-enter-active { transition: transform .45s var(--ease-spring), opacity .3s; }
.msg-leave-active { transition: opacity .15s; position: absolute; }
.msg-enter-from { transform: translateY(10px) scale(.92); opacity: 0; }
.msg-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.swap-enter-active, .swap-leave-active { transition: transform .22s var(--ease), opacity .2s; }
.swap-enter-from { transform: rotate(-90deg) scale(.5); opacity: 0; }
.swap-leave-to { transform: rotate(90deg) scale(.5); opacity: 0; }
.pop-enter-active { transition: transform .45s var(--ease-spring); }
.pop-leave-active { transition: transform .2s, opacity .2s; }
.pop-enter-from, .pop-leave-to { transform: scale(0); opacity: 0; }

@media (max-width: 480px) {
  .chat-root { right: 12px; bottom: 12px; }
  .panel { width: calc(100vw - 24px); height: min(580px, calc(100dvh - 100px)); }
}
</style>
