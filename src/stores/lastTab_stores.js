import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLastTabStore = defineStore(
  'last tab',
  () => {
    const lastTab = ref(1)

    return {
      lastTab
    }
  },
  {
    persist: {
      storage: sessionStorage
    }
  }
)
