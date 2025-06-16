import { getTeamData } from './getTeamData'

export async function fetchStyleOptions(characterName, team) {
  try {
    const data = await getTeamData(team)
    const characterData = data[characterName]

    if (!characterData || !characterData.style) {
      throw new Error('Character data or styles not found')
    }

    const englishName = characterData['english name']
    const styles = characterData.style

    return Object.entries(styles).map(([_, info]) => ({
      value: info.value,
      names: info.names,
      icon: `char-images/${team}/${englishName}/${info.id}.webp`,
    }))
  } catch (error) {
    console.error('Error fetching style options:', error)
    return []
  }
}
