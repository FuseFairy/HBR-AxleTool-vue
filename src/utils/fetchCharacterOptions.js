import axios from 'axios'
import { getAssetsFile } from './getAssetsFile'

export async function fetchCharacterOptions(team) {
  try {
    const response = await axios.get(getAssetsFile(`char-data/${team}.json`))
    const data = response.data
    return Object.entries(data).map(([_, info]) => ({
      value: info.value,
      names: info.names,
      icon: `char-images/${team}/${info['english name']}/icon.webp`,
    }))
  } catch (error) {
    console.error('Error fetching character options:', error)
    return []
  }
}
