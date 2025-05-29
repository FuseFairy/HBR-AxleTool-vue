import { useSkillStore } from '@/store/axle'
import { useCharStore } from '@/store/char'
import { get, isEmpty, filter, map } from 'lodash-es'

export function getTargetOptions(row, key) {
  const skillStore = useSkillStore()
  const charStore = useCharStore()
  const currentSkill = skillStore.skills[row][key]
  const style = get(currentSkill, 'style')

  if (currentSkill && style != null) {
    const selectedTab = currentSkill['selectedTab']
    const team = charStore.selections[selectedTab]

    const charOptions = filter(
      map(Object.values(team), (teamObject) => teamObject.character_info),
      (characterInfo) => !isEmpty(characterInfo)
    )

    return charOptions
  } else {
    return []
  }
}
