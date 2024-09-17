import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCharStore = defineStore('character_select', () => {
  const selections = ref({})

  const setSelection = (buttonKey, type, value) => {
    if (!selections.value[buttonKey]) {
      selections.value[buttonKey] = {}
    }
    selections.value[buttonKey][type] = value
  }

  const getSelection = (buttonKey, type) => {
    return selections.value[buttonKey]?.[type] || null
  }

  return {
    selections,
    setSelection,
    getSelection
  }
})