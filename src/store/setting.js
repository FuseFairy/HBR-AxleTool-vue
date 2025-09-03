import { defineStore } from 'pinia'
import { ref } from 'vue'

const VERSION = '1.0.0' // Initial version for setting store

export const useSettingStore = defineStore(
  'setting',
  () => {
    const lang = ref(null)

    return {
      lang,
    }
  },
  {
    persist: {
      storage: localStorage,
      serializer: {
        serialize: (state) => {
          return JSON.stringify({ data: state, version: VERSION })
        },
        deserialize: (jsonString) => {
          if (!jsonString) return {}

          const storedState = JSON.parse(jsonString)

          // Handle migration if needed
          if (storedState.version === VERSION) {
            return storedState.data
          } else {
            console.warn(
              `[Setting Store] Data version mismatch. Stored: ${storedState.version}, Current: ${VERSION}. Resetting store.`,
            )
            return {}
          }
        },
      },
    },
  },
)
