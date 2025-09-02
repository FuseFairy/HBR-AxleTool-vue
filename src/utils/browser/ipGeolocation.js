import { useSettingStore } from '@/store/setting'

export async function runIPGeolocation() {
  const settingStore = useSettingStore()

  if (settingStore.lang !== null) {
    // console.log('settingStore.lang is not null, skipping IP Geolocation API call.')
    return
  }

  const countryLangMap = {
    TW: 'zh-TW',
    JP: 'jp',
    CN: 'zh-CN-CN',
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 800)

  try {
    const response = await fetch(`https://ipinfo.io/json?token=${import.meta.env.VITE_IPINFO_TOKEN}`, {
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    const countryCode = data.country
    settingStore.lang = countryLangMap[countryCode] || 'jp'
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('IP Geolocation API request timeout.')
    } else {
      console.error('IP Geolocation API request error:', error.message)
    }
    settingStore.lang = 'jp'
  } finally {
    clearTimeout(timeoutId)
  }
}
