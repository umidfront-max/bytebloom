# Bytebloom Technologies — landing (Vue 3, Composition API)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```

## Tuzilma
- `src/App.vue` — bo'limlarni yig'adi
- `src/components/` — Header, Hero, MarqueeStrip, Services, Why, Process, About, Contact, Footer, ChatWidget
- `src/composables/useTheme.js` — dark/light rejim (localStorage + tizim sozlamasi, View Transitions bilan doira effekti)
- `src/composables/useReveal.js` — `v-reveal` direktivasi (scroll animatsiya, ixtiyoriy kechikish ms; `.left` / `.right` / `.scale` modifikatorlari)
- `src/composables/usePointer.js` — `v-spotlight` (kartochkada kursor yorug'ligi) va `v-magnetic` (tugma kursorga tortiladi)
- `src/data.js` — barcha matnlar va ro'yxatlar bitta joyda
- `src/style.css` — rang tokenlari (`:root` va `[data-theme="dark"]`)

## Chat
`ChatWidget.vue` hozircha lokal: salomlashish + xizmatlar bo'yicha tezkor chiplar va oddiy avtomatik javob.
Real botga ulash uchun `botReply()` funksiyasini API chaqiruviga almashtiring.

## Forma
`ContactSection.vue` da `submit()` ichida 1.2s simulyatsiya — o'z backend'ingizga ulang.
