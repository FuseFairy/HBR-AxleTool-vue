import axios from 'axios'
import { getAssetsFile } from './util'

export async function fetchPassiveSkillOptions(characterName, team, styleName) {
  try {
    const response = await axios.get(getAssetsFile(`char_data/${team}.json`))
    const data = response.data
    const characterData = data[characterName]

    if (!characterData || !characterData.style) {
      throw new Error('Character data or styles not found')
    }

    const passiveSkills = [
      ...(characterData.skill[styleName]?.['passive skill'] || []),
      ...(characterData['passive skill'] || [])
    ]

    return passiveSkills
  } catch (error) {
    console.error('Error fetching skill options:', error)
    return []
  }
}
