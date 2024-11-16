import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useActiveTabStore = defineStore(
  'active tab',
  () => {
    const activeTab = ref('Phase 1')

    const handleTabChange = (newTab) => {
      activeTab.value = newTab.value
    }

    return {
      activeTab,
      handleTabChange
    }
  },
  {
    persist: {
      storage: sessionStorage
    }
  }
)
