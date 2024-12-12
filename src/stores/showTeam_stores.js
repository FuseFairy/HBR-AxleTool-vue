import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useShowTeamStore = defineStore(
  'showTeam',
  () => {
    const showTeam = ref([1])

    function setShowTeam(row_list) {
      showTeam.value = row_list
    }

    return {
      showTeam,
      setShowTeam,
    }
  },
  {
    persist: {
      storage: localStorage,
    },
  }
)
