import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore(
  'setting',
  () => {
    const lang = ref(null)

    return {
      lang,
    }
  },
  {
    persist: {
      storage: localStorage,
    },
  }
)
