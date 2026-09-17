# Bytebloom Technologies — landing (Vue 3, Composition API)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
npm run deploy   # build + GitHub Pages (gh-pages branch) → https://umidfront-max.github.io/bytebloom/
```

## Tuzilma
- `src/App.vue` — bo'limlarni yig'adi
- `src/components/` — Header, Hero, MarqueeStrip, Services, Why, Process, About, Contact, Footer, ChatWidget
- `src/composables/useTheme.js` — dark/light rejim (localStorage + tizim sozlamasi, View Transitions bilan doira effekti)
- `src/composables/useReveal.js` — `v-reveal` direktivasi (scroll animatsiya, ixtiyoriy kechikish ms; `.left` / `.right` / `.scale` modifikatorlari)
- `src/composables/usePointer.js` — `v-spotlight` (kartochkada kursor yorug'ligi) va `v-magnetic` (tugma kursorga tortiladi)
- `src/composables/useSectionFx.js` — bo'lim fon effektlari uchun kursor holati (`--cx/--cy/--px/--py`) va ekrandan chiqqanda pauza
- `src/components/fx/NetworkField.vue` — "Afzalliklar" fonidagi canvas tugunlar tarmog'i
- `src/components/brand/BrandLockup.vue` — `src/logo.svg` dan olingan logo (ranglari `--logo-mark` / `--logo-text` orqali)
- `public/favicon.svg` — o'sha logo monogrammasi, landing gradienti bilan
- `src/data.js` — barcha matnlar va ro'yxatlar bitta joyda
- `src/style.css` — rang tokenlari (`:root` va `[data-theme="dark"]`)

## Backend (ByteBloom API)
Manzil `.env` orqali beriladi (namuna: `.env.example`):

```bash
VITE_API_BASE_URL=http://192.168.1.58:8082
```

- `src/api/client.js` — `fetch` o'rami: `credentials: include`, xatoliklarni o'zbekcha xabarga aylantiradi (`ApiError`)
- `src/api/public.js` — public endpointlar: lead, chat sessiya/xabarlar, greeting
- `src/api/realtime.js` — STOMP + SockJS orqali `/topic/chat/{shortId}` ga obuna (faqat qabul qilish)

Ishlatilgan endpointlar: `POST /api/public/leads`, `POST /api/public/chat/sessions`,
`POST|GET /api/public/chat/sessions/{shortId}/messages`, `GET /api/public/settings/greeting`.

Chat sessiyasi `localStorage` da (`bb-chat-session`) saqlanadi. Xabarlar WebSocket orqali keladi;
ulanib bo'lmasa har 3 soniyada `?after=` bilan polling ishlaydi. Sessiya serverda topilmasa (404) yangisi ochiladi.

Til (`UZ|RU|EN`) header'dagi tanlagichdan olinadi — `src/composables/useLang.js`.

> Backend `CORS_ALLOWED_ORIGINS` ro'yxatiga frontend domeni qo'shilgan bo'lishi shart, aks holda brauzer so'rovlarni bloklaydi.

## Chat
`ChatWidget.vue` backendga ulangan: greeting va tezkor tugmalar `/settings/greeting` dan keladi,
sessiya birinchi xabarda ochiladi, operator javobi WebSocket yoki polling orqali tushadi.
Backend tezkor tugmalar bermasa — `data.js` dagi xizmatlar ro'yxati ishlatiladi.

## Forma
`ContactSection.vue` `POST /api/public/leads` ga yuboradi. Xatolik bo'lsa server xabari forma ostida ko'rsatiladi
(429 — rate limit, 400 — validatsiya), tugma esa "Qayta yuborish" holatiga o'tadi.
