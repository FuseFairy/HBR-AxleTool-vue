import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const VERSION = '1.0.0' // Initial version for axleCollection store

export const useAxleCollectionStore = defineStore(
  'axleCollection',
  () => {
    const axles = ref([])
    const sortOrder = ref('desc') // 'desc' for newest first, 'asc' for oldest first

    function generateUniqueCode() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      const charactersLength = characters.length
      for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    }

    function addAxle(axleData) {
      const { name, data, time } = axleData
      const uniqueName = name?.trim() || generateUniqueCode()
      const id = uuidv4()
      const newAxle = { id, name: uniqueName, data, time }

      axles.value.push(newAxle)

      return id
    }

    function deleteAxle(id) {
      axles.value = axles.value.filter((axle) => axle.id !== id)
    }

    function updateAxleData(id, name, newData) {
      const index = axles.value.findIndex((axle) => axle.id === id)
      if (index !== -1) {
        axles.value[index].name = name?.trim() || generateUniqueCode()
        axles.value[index].data = newData
      }
    }

    return {
      axles,
      sortOrder,
      addAxle,
      deleteAxle,
      updateAxleData,
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
              `[Axle Collection Store] Data version mismatch. Stored: ${storedState.version}, Current: ${VERSION}. Resetting store.`,
            )
            return {}
          }
        },
      },
    },
  },
)
