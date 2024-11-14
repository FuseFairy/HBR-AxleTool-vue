import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useShowRowStore = defineStore(
  'showRow',
  () => {
    // 使用 ref 而非 reactive
    const showRow = ref(['rank', 'earring', 'passive skill', 'skill'])

    function setShowRow(row_list) {
      showRow.value = row_list
    }

    return {
      showRow,
      setShowRow,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
)
