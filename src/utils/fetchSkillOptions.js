import { getTeamData } from './getTeamData'
import { fetchCommonData } from './fetchCommonData'

export async function fetchSkillOptions(characterName, team, styleName) {
  try {
    const data = await getTeamData(team)
    const characterData = data[characterName]
    const { universalSkills } = await fetchCommonData()

    if (!characterData || !characterData.style) {
      throw new Error('Character data or styles not found')
    }

    const commonSkills = characterData.skill.common || {}
    const specificSkills = Object.fromEntries(
      Object.entries(characterData.skill[styleName] || {}).filter(
        ([key]) => key !== 'command action' && key !== 'passive skill'
      )
    )

    const allSkills = [
      ...Object.entries(specificSkills).map(([, info]) => ({
        value: info['value'],
        names: info['names'],
        sp: info['sp'],
        owner: info['owner'],
      })),
      ...Object.entries(commonSkills).map(([, info]) => ({
        value: info['value'],
        names: info['names'],
        sp: info['sp'],
      })),
      ...universalSkills.map((skill) => ({
        value: skill.value,
        names: skill.names,
        sp: skill.sp,
      })),
    ]
    return allSkills
  } catch (error) {
    console.error('Error fetching skill options:', error)
    return []
  }
}
