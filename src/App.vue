<script setup>
import AppHeader from './components/AppHeader.vue'
import HeroSection from './components/HeroSection.vue'
import MarqueeStrip from './components/MarqueeStrip.vue'
import ServicesSection from './components/ServicesSection.vue'
import WhySection from './components/WhySection.vue'
import ProcessSection from './components/ProcessSection.vue'
import AboutSection from './components/AboutSection.vue'
import ContactSection from './components/ContactSection.vue'
import AppFooter from './components/AppFooter.vue'
import ChatWidget from './components/ChatWidget.vue'
</script>

<template>
  <div class="bg-aurora" aria-hidden="true"><i class="a1"></i><i class="a2"></i><i class="a3"></i></div>
  <div class="bg-grid" aria-hidden="true"></div>
  <div class="bg-noise" aria-hidden="true"></div>

  <AppHeader />

  <main>
    <HeroSection />
    <MarqueeStrip />
    <ServicesSection />
    <WhySection />
    <ProcessSection />
    <AboutSection />
    <ContactSection />
  </main>

  <AppFooter />
  <ChatWidget />
</template>
