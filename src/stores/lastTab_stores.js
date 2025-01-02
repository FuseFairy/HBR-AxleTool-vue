import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLastTabStore = defineStore(
  'last tab',
  () => {
    const axle_lastTab = ref(1)
    const box_lastTab = ref(1)

    return {
      axle_lastTab,
      box_lastTab
    }
  },
  {
    persist: {
      storage: sessionStorage
    }
  }
)
