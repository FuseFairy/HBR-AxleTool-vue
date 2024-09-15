import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCharStore = defineStore('character_select', () => {
  const selectedTeam = ref(null)
  const selectedCharacter = ref(null)
  const selectedStyle = ref(null)

  return {
    selectedTeam,
    selectedCharacter,
    selectedStyle
  }
})