import { getTeamData } from '@/utils/state-getters/getTeamData'
import { fetchCommonData } from '@/utils/data-fetching/fetchCommonData'

export async function fetchPassiveSkillOptions(characterName, team, styleName) {
  try {
    const data = await getTeamData(team)
    const { defaultPassiveSkill } = await fetchCommonData()
    const characterData = data[characterName]

    if (!characterData || !characterData.style) {
      throw new Error('Character data or styles not found')
    }

    let passiveSkills = []

    const stylePassiveSkillObj = characterData.skill?.[styleName]?.['passive skill']
    if (stylePassiveSkillObj && typeof stylePassiveSkillObj === 'object') {
      passiveSkills.push(...Object.values(stylePassiveSkillObj))
    }

    const rootPassiveSkillObj = characterData['passive skill']
    if (rootPassiveSkillObj && typeof rootPassiveSkillObj === 'object') {
      passiveSkills.push(...Object.values(rootPassiveSkillObj))
    }

    if (defaultPassiveSkill && Array.isArray(defaultPassiveSkill)) {
      passiveSkills.push(...defaultPassiveSkill)
    }

    const formattedPassiveSkills = passiveSkills.map((skill) => ({
      value: skill.value,
      names: skill.names,
    }))

    return formattedPassiveSkills
  } catch (error) {
    console.error('Error fetching skill options:', error)
    return []
  }
}
