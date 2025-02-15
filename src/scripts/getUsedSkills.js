import { useCharStore } from '@/stores/char_stores'
import { useSkillStore } from '@/stores/skill_stores'
import { useSettingStore } from '@/stores/setting_stores'
import _find from 'lodash/find'

export function getUsedSkills(selectedTab) {
  const skillsDictionary = {}
  const charStore = useCharStore()
  const skillStore = useSkillStore()
  const settingStore = useSettingStore()

  Object.values(charStore.selections[selectedTab]).forEach((selection) => {
    const style = selection['style']

    if (style && !skillsDictionary[style]) {
      skillsDictionary[style] = new Set()
    }

    skillStore.skills.forEach((group) => {
      group.forEach((skillEntry) => {
        if (skillEntry.style === style && skillEntry.selectedTab === selectedTab) {
          const { skill } = skillEntry;
          const foundCommandSkill = _find(selection['commandSkill'], { value: skill });
          if (skill && !skillsDictionary[style].has(skill) && !foundCommandSkill) {
            skillsDictionary[style].add(skill);
          }
        }
      })
    })

    const sortedSkills = (() => {
      const skillNameMap = new Map();
      selection['skill'].forEach(skill => {
        skillNameMap.set(skill.value, skill["names"][settingStore.lang]);
      });
      
      const skillsArray = Array.from(skillsDictionary[style]);
    
      skillsArray.sort((a, b) => {
        const nameA = skillNameMap.get(a); 
        const nameB = skillNameMap.get(b);
        return nameA.length - nameB.length;
      });
      return skillsArray;
    })();
    
    skillsDictionary[style] = new Set(sortedSkills);
  })

  return skillsDictionary
}

