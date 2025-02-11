import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore(
  'setting',
  () => {
    const lang = ref("zh-TW")

    return {
      lang
    }
  },
  {
    persist: {
      storage: sessionStorage
    }
  }
)
