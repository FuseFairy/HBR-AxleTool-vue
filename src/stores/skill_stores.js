import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSkillStore = defineStore(
  'skill',
  () => {
    const skills = ref({})
    const turns = ref({})

    function adjustSkills(PhaseID, rows) {
      if (!skills.value[PhaseID]) {
        skills.value[PhaseID] = []
        turns.value[PhaseID] = []
      }

      const difference = rows - skills.value[PhaseID].length

      if (difference > 0) {
        const newSkills = Array.from({ length: difference }, () => [
          { style: null, style_img: null, skill: null, target: null },
          { style: null, style_img: null, skill: null, target: null },
          { style: null, style_img: null, skill: null, target: null }
        ])
        skills.value[PhaseID].push(...newSkills)

        const newTurns = Array.from({ length: difference }, () => ({ turn: null, od: null }))
        turns.value[PhaseID].push(...newTurns)
      }
      else if (difference < 0) {
        skills.value[PhaseID].splice(rows)
        turns.value[PhaseID].splice(rows)
      }
    }

    return {
      skills,
      turns,
      adjustSkills
    }
  },
  {
    persist: {
      storage: sessionStorage
    }
  }
)
