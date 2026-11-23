import { defineStore } from 'pinia'
import { ref } from 'vue'
import { compressToUTF16, decompressFromUTF16 } from 'lz-string'

// Resonance (共鳴) supporting character attached to a team slot
export const createEmptySupport = () => ({
  team: null,
  character: null,
  style: null,
  style_id: null,
  img: null,
  rank: null,
  crucial: false, // highlighted in the table as important to the timeline
})

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
                style_id: null,
                rank: null,
                flower: false,
                passiveSkill: [],
                passiveSkill_value: [],
                commandSkill: [],
                earring: null,
                skill: [],
                img: null,
                spiritual: null,
                reincarnation: null,
                support: createEmptySupport(),
              },
            ]),
          ),
        ]),
      ),
    )

    const setSelection = (buttonKey, type, value, selectedTab) => {
      if (!selections.value[selectedTab][buttonKey]) {
        selections.value[selectedTab][buttonKey] = {
          character: null,
          character_info: {},
          style: null,
          style_id: null,
          rank: null,
          flower: false,
          passiveSkill: [],
          commandSkill: null,
          earring: null,
          skill: [],
          img: null,
          spiritual: null,
          reincarnation: null,
          support: createEmptySupport(),
        }
      }
      selections.value[selectedTab][buttonKey][type] = value === undefined ? null : value
    }

    const getSelection = (buttonKey, type, selectedTab) => {
      return selections.value[selectedTab][buttonKey]?.[type] || null
    }

    // Data migration
    for (const team of Object.values(selections.value)) {
      for (const selection of Object.values(team)) {
        if (selection.style_id === undefined) {
          if (selection.img) {
            try {
              const pathParts = selection.img.split('/')
              const fileName = pathParts.pop()
              selection.style_id = fileName.split('.').slice(0, -1).join('.')
              // eslint-disable-next-line no-unused-vars
            } catch (e) {
              selection.style_id = null
            }
          } else {
            selection.style_id = null
          }
        }
      }
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
  },
)
