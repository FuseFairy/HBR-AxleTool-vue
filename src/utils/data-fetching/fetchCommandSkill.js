import { getTeamData } from '@/utils/state-getters/getTeamData'
import { isObject, values } from 'lodash-es'
import { fetchCommonData } from '@/utils/data-fetching/fetchCommonData'

export async function fetchCommandSkill(characterName, team, styleName) {
  try {
    const data = await getTeamData(team)
    const characterData = data[characterName]
    const { defaultCommandSkill } = await fetchCommonData()

    if (!characterData || !characterData.style) {
      throw new Error('Character data or styles not found')
    }

    const commandActionObject = characterData.skill[styleName]?.['command action']
    let commandSkills = []

    if (commandActionObject && isObject(commandActionObject)) {
      commandSkills = values(commandActionObject)
    } else {
      commandSkills = defaultCommandSkill
    }

    const formattedCommandSkills = commandSkills.map((skill) => ({
      value: skill.value,
      names: skill.names,
      sp: skill.sp,
    }))

    return formattedCommandSkills
  } catch (error) {
    console.error('Error fetching command skill options:', error)
    return []
  }
}
