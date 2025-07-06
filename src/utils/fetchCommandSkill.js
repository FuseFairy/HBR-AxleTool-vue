import { getTeamData } from './getTeamData'
import { isObject, values } from 'lodash-es'

export async function fetchCommandSkill(characterName, team, styleName) {
  try {
    const data = await getTeamData(team)
    const characterData = data[characterName]
    const defaultCommandSkill = [
      { value: '普攻', names: { 'zh-TW': '普通攻擊', jp: '通常攻撃', 'zh-CN': '普通攻击', 'zh-CN-CN': '通常攻撃' }, sp: 0 },
    ]

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
