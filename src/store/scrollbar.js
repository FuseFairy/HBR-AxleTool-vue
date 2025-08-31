import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScrollbarStore = defineStore(
  'scrollbar',
  () => {
    const topOffset = ref(0)
    const instance = ref(null)

    return {
      topOffset,
      instance,
    }
  },
  {
    persist: {
      storage: localStorage,
    },
  },
)
