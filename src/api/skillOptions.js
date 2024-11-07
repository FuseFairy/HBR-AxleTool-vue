import axios from 'axios'
import { getAssetsFile } from './util'

export async function fetchSkillOptions(characterName, team, styleName) {
  try {
    const response = await axios.get(getAssetsFile(`char_data/${team}.json`))
    const data = response.data
    const characterData = data[characterName]

    if (!characterData || !characterData.style) {
      throw new Error('Character data or styles not found')
    }

    const commonSkills = characterData.skill.common || {}
    const specificSkills = Object.fromEntries(
      Object.entries(characterData.skill[styleName] || {}).filter(
        ([key]) => key !== "command action" && key !== "passive skill"
      )
    );
    const universalSkills = {
      批判性思考: 5,
      修復之光: 11,
      DRIVE增幅: 6,
      防護罩: 3,
      進攻上升: 4,
      專注力: 4,
      重點保養: 1,
      自我療癒: 4,
      軟化: 9,
      衰減之力: 6,
      火焰重力子: 6,
      雷霆重力子: 6,
      暗黑重力子: 6,
      光明重力子: 6,
      寒冰重力子: 6
    }

    const allSkills = [
      ...Object.entries(specificSkills).map(([name, sp]) => ({ name, sp })),
      ...Object.entries(commonSkills).map(([name, sp]) => ({ name, sp })),
      ...Object.entries(universalSkills).map(([name, sp]) => ({ name, sp }))
    ]
    return allSkills
  } catch (error) {
    console.error('Error fetching skill options:', error)
    return []
  }
}
