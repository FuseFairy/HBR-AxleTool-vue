import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { compressToUTF16, decompressFromUTF16 } from 'lz-string'

export const useSkillStore = defineStore(
  'skill',
  () => {
    const axleName = ref('')
    const axleId = ref('')
    const skills = ref([])
    const turns = ref([])

    function adjustSkills(rows) {
      const difference = rows - skills.value.length

      if (difference > 0) {
        const newSkills = Array.from({ length: difference }, () => [
          {
            selectedTab: null,
            style: null,
            style_id: null,
            activeFormId: null,
            style_img: null,
            skill: null,
            target: null,
          },
          {
            selectedTab: null,
            style: null,
            style_id: null,
            activeFormId: null,
            style_img: null,
            skill: null,
            target: null,
          },
          {
            selectedTab: null,
            style: null,
            style_id: null,
            activeFormId: null,
            style_img: null,
            skill: null,
            target: null,
          },
        ])
        skills.value.push(...newSkills)

        const newTurns = Array.from({ length: difference }, () => ({ id: uuidv4(), turn: null, od: null }))
        turns.value.push(...newTurns)
      } else if (difference < 0) {
        skills.value.splice(rows)
        turns.value.splice(rows)
      }
    }

    function ensureIds() {
      turns.value.forEach((turn) => {
        if (!turn.id) {
          turn.id = uuidv4()
        }
      })
    }

    function resetCurrentAxle() {
      axleName.value = ''
      axleId.value = ''
      skills.value = []
      turns.value = []
    }

    // Data migration
    skills.value.forEach((row) => {
      row.forEach((skill) => {
        if (skill && skill.style_id === undefined) {
          if (skill.style_img) {
            try {
              const pathParts = skill.style_img.split('/')
              const fileName = pathParts.pop()
              skill.style_id = fileName.split('.').slice(0, -1).join('.')
              // eslint-disable-next-line no-unused-vars
            } catch (e) {
              skill.style_id = null
            }
          } else {
            skill.style_id = null
          }
        }
        if (skill && skill.activeFormId === undefined) {
          skill.activeFormId = null
        }
      })
    })

    return {
      axleName,
      axleId,
      skills,
      turns,
      adjustSkills,
      ensureIds,
      resetCurrentAxle,
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
