import axios from 'axios'
import { getAssetsFile } from './util'

export async function fetchStyleOptions(characterName, team) {
  try {
    const response = await axios.get(getAssetsFile(`char_data/${team}.json`))
    const data = response.data
    const characterData = data[characterName]

    if (!characterData || !characterData.style) {
      throw new Error('Character data or styles not found')
    }

    const englishName = characterData['english name']
    const styles = characterData.style

    return Object.entries(styles).map(([_, info]) => ({
      value: info.value,
      names: info.names,
      icon: `char_images/${team}/${englishName}/${info.id}.webp`
    }))
  } catch (error) {
    console.error('Error fetching style options:', error)
    return []
  }
}
