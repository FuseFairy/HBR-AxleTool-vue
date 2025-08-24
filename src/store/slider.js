import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSliderStore = defineStore(
  'slider',
  () => {
    const rows = ref(0)

    return {
      rows,
    }
  },
  {
    persist: {
      storage: localStorage,
    },
  }
)
