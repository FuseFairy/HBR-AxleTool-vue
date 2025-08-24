import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useSkillStore } from './axle.js'

export const useAxleCollectionStore = defineStore(
  'axleCollection',
  () => {
    const axles = ref([])
    const sortOrder = ref('desc') // 'desc' for newest first, 'asc' for oldest first
    const skillStore = useSkillStore()

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
      const newAxle = { id, name: uniqueName, data, time }

      if (sortOrder.value === 'desc') {
        axles.value.unshift(newAxle) // Add to the beginning for newest first
      } else {
        axles.value.push(newAxle) // Add to the end for oldest first
      }
      return id
    }

    function updateAxleData(id, newData) {
      const index = axles.value.findIndex(axle => axle.id === id)
      if (index !== -1) {
        axles.value[index].name = skillStore.axleName && skillStore.axleName.trim() !== '' ? skillStore.axleName : generateUniqueCode()
        axles.value[index].data = newData
      }
    }

    return {
      axles,
      sortOrder,
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
