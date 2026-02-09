import { useCharStore } from '@/store/char'
import { useSkillStore } from '@/store/axle'
import { useSettingStore } from '@/store/setting'
import { find } from 'lodash-es'

export function getUsedSkills(selectedTab) {
  const skillsDictionary = {}
  const charStore = useCharStore()
  const skillStore = useSkillStore()
  const settingStore = useSettingStore()

  Object.values(charStore.selections[selectedTab]).forEach((selection) => {
    const style = selection['style']

    if (style && !skillsDictionary[style]) {
      const skillCounts = {} // 用來記錄次數

      skillStore.skills.forEach((group) => {
        group.forEach((skillEntry) => {
          if (skillEntry.style === style && skillEntry.selectedTab === selectedTab) {
            const { skill } = skillEntry
            const foundCommandSkill = find(selection['commandSkill'], { value: skill })
            if (skill && !foundCommandSkill) {
              skillCounts[skill] = (skillCounts[skill] || 0) + 1
            }
          }
        })
      })

      const skillNameMap = new Map()
      selection['skill'].forEach((skill) => {
        skillNameMap.set(skill.value, skill['names'][settingStore.lang])
      })

      // 轉換為陣列並排序
      const sortedSkills = Object.entries(skillCounts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => {
          const nameA = skillNameMap.get(a.value) || ''
          const nameB = skillNameMap.get(b.value) || ''
          return nameA.length - nameB.length
        })

      skillsDictionary[style] = sortedSkills
    }
  })

  return skillsDictionary
}
