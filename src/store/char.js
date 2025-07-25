import { defineStore } from 'pinia'
import { ref } from 'vue'
import { compressToUTF16, decompressFromUTF16 } from 'lz-string'

export const useCharStore = defineStore(
  'characterSelect',
  () => {
    const selections = ref(
      Object.fromEntries(
        Array.from({ length: 6 }, (_, i) => [
          i + 1,
          Object.fromEntries(
            Array.from({ length: 6 }, (_, j) => [
              j + 1,
              {
                character: null,
                character_info: {},
                style: null,
                rank: null,
                flower: false,
                passiveSkill: [],
                passiveSkill_value: [],
                commandSkill: [],
                earring: null,
                skill: [],
                img: null,
                spiritual: null,
              },
            ])
          ),
        ])
      )
    )

    const setSelection = (buttonKey, type, value, selectedTab) => {
      if (!selections.value[selectedTab][buttonKey]) {
        selections.value[selectedTab][buttonKey] = {
          character: null,
          style: null,
          rank: null,
          flower: false,
          passiveSkill: [],
          commandSkill: null,
          earring: null,
          skill: [],
          img: null,
          spiritual: null,
        }
      }
      selections.value[selectedTab][buttonKey][type] = value === undefined ? null : value
    }

    const getSelection = (buttonKey, type, selectedTab) => {
      return selections.value[selectedTab][buttonKey]?.[type] || null
    }

    return {
      selections,
      setSelection,
      getSelection,
    }
  },
  {
    persist: {
      storage: localStorage,
      serializer: {
        serialize: (state) => {
          const jsonString = JSON.stringify(state)
          return compressToUTF16(jsonString)
        },
        deserialize: (compressedString) => {
          const jsonString = decompressFromUTF16(compressedString)
          return jsonString ? JSON.parse(jsonString) : {}
        },
      },
    },
  }
)
