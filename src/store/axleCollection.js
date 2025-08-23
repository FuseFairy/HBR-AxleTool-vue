import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useAxleCollectionStore = defineStore(
  'axleCollection',
  () => {
    const axles = ref([])

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
      const uniqueName = name && name.trim() !== '' ? name : generateUniqueCode()
      const id = uuidv4()
      axles.value.push({ id, name: uniqueName, data, time })
      return id
    }

    function updateAxleData(id, newData) {
      const index = axles.value.findIndex(axle => axle.id === id)
      if (index !== -1) {
        axles.value[index].data = newData
      }
    }

    return {
      axles,
      addAxle,
      updateAxleData,
    }
  },
  {
    persist: {
      storage: localStorage,
    },
  }
)
