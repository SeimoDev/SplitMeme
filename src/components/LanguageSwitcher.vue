<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLanguage } from '../locales'

const { locale, t } = useI18n()

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中' }
]

const currentLang = computed(() => locale.value)

const switchLanguage = (lang: string) => {
  setLanguage(lang)
}
</script>

<template>
  <div class="language-switcher">
    <button
      v-for="lang in languages"
      :key="lang.code"
      class="lang-btn"
      :class="{ active: currentLang === lang.code }"
      @click="switchLanguage(lang.code)"
      :title="t(`language.${lang.code}`)"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<style scoped>
.language-switcher {
  display: flex;
  gap: 4px;
  background: var(--color-bg-tertiary);
  padding: 4px;
  border-radius: var(--radius-sm);
}

.lang-btn {
  padding: 4px 10px;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.lang-btn:hover {
  color: var(--color-text-primary);
}

.lang-btn.active {
  background: var(--color-accent);
  color: var(--color-bg-primary);
}
</style>

