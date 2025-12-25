import { createI18n } from 'vue-i18n'
import en from './en'
import zh from './zh'

// Get saved language or detect from browser
const getSavedLanguage = (): string => {
  const saved = localStorage.getItem('language')
  if (saved && ['en', 'zh'].includes(saved)) {
    return saved
  }
  // Detect browser language
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) {
    return 'zh'
  }
  return 'en'
}

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getSavedLanguage(),
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

export default i18n

// Helper to save language preference
export const setLanguage = (lang: string) => {
  localStorage.setItem('language', lang)
  i18n.global.locale.value = lang as 'en' | 'zh'
}

export const getCurrentLanguage = () => i18n.global.locale.value

