import { useSettingStore } from '@/store/setting'

export function runIPGeolocation() {
  const settingStore = useSettingStore()

  if (settingStore.lang !== null) {
    console.log('settingStore.lang is not null, skipping IP Geolocation API call.')
    return
  }

  const countryLangMap = {
    TW: 'zh-TW',
    JP: 'jp',
  }

  let targetLang = 'jp'

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 800)

  fetch(`https://ipinfo.io/json?token=${import.meta.env.VITE_IPINFO_TOKEN}`, {
    signal: controller.signal,
  })
    .then((response) => {
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    })
    .then((data) => {
      const countryCode = data.country
      targetLang = countryLangMap[countryCode] || 'jp'
      settingStore.lang = targetLang
    })
    .catch((error) => {
      clearTimeout(timeoutId)

      if (error.name === 'AbortError') {
        console.error('IP Geolocation API request timeout.')
      } else {
        console.error('IP Geolocation API request error:', error.message)
      }
      settingStore.lang = 'jp'
    })
}
