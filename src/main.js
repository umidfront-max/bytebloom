import { createApp } from 'vue'
import App from './App.vue'
import { vReveal } from './composables/useReveal'
import { vSpotlight, vMagnetic } from './composables/usePointer'
import './style.css'

createApp(App)
  .directive('reveal', vReveal)
  .directive('spotlight', vSpotlight)
  .directive('magnetic', vMagnetic)
  .mount('#app')
