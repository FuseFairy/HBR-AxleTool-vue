import { useCharStore } from '@/stores/char_stores'
import { useSkillStore } from '@/stores/skill_stores'

export function getUsedSkills(selectedTab) {
  const skillsDictionary = {}
  const charStore = useCharStore()
  const skillStore = useSkillStore()

  Object.values(charStore.selections[selectedTab]).forEach((selection) => {
    const style = selection['style']

    if (style && !skillsDictionary[style]) {
      skillsDictionary[style] = new Set()
    }

    skillStore.skills.forEach((group) => {
      group.forEach((skillEntry) => {
        if (skillEntry.style === style && skillEntry.selectedTab === selectedTab) {
          const { skill } = skillEntry

          if (skill && skill !== selection['commandSkill'] && !skillsDictionary[style].has(skill)) {
            skillsDictionary[style].add(skill)
          }
        }
      })
    })
  })

  Object.keys(skillsDictionary).forEach((style) => {
    const sortedSkills = Array.from(skillsDictionary[style])
      .sort((a, b) => a.length - b.length)
    skillsDictionary[style] = new Set(sortedSkills)
  })

  return skillsDictionary
}

