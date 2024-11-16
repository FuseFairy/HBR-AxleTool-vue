import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSliderStore = defineStore(
  'slider',
  () => {
    const rows = ref({
      'Phase 1': 0,
      'Phase 2': 0,
      'Phase 3': 0,
      'Phase 4': 0,
      'Phase 5': 0
    })

    function setValue(phaseID, newValue) {
      rows.value[phaseID] = newValue
    }

    return {
      rows,
      setValue
    }
  },
  {
    persist: {
      storage: sessionStorage
    }
  }
)
