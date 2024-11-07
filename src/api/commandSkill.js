import axios from 'axios'
import { getAssetsFile } from './util'

export async function fetchCommandSkill(characterName, team, styleName) {
  try {
    const response = await axios.get(getAssetsFile(`char_data/${team}.json`))
    const data = response.data
    const characterData = data[characterName]

    if (!characterData || !characterData.style) {
      throw new Error('Character data or styles not found')
    }

    const commandSkill = characterData.skill[styleName]?.['command action'] || '普攻'

    return commandSkill
  } catch (error) {
    console.error('Error fetching command skill options:', error)
    return []
  }
}
