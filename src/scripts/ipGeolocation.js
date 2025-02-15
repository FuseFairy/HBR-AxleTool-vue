import { useSettingStore } from '@/stores/setting_stores';

export function runIPGeolocation() {
  const settingStore = useSettingStore();

  if (settingStore.lang !== null) {
    console.log("settingStore.lang is not null, skipping IP Geolocation API call.");
    return;
  }

  const countryLangMap = {
    'TW': 'zh-TW',
    'JP': 'jp',
  };

  let targetLang = 'jp'; // defaut language is JP

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 600);

  fetch('http://ip-api.com/json', { signal: controller.signal })
    .then(response => {
      clearTimeout(timeoutId);
      return response.json();
    })
    .then(data => {
      if (data.status === 'success') {
        const countryCode = data.countryCode;
        targetLang = countryLangMap[countryCode] || 'jp';
      } else {
        console.error('IP Geolocation API request failed:', data.message);
      }
      settingStore.lang = targetLang;
    })
    .catch(error => {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        console.error('IP Geolocation API request timeout: Request aborted after 3 seconds.');
      } else {
        console.error('IP Geolocation API request error:', error);
      }
      settingStore.lang = 'jp';
    });
}