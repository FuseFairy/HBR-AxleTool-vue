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

    return Object.entries(styles).map(([, info]) => {
      const iconId = Array.isArray(info.id) ? info.id[0] : info.id
      return {
        value: info.value,
        names: info.names,
        id: info.id,
        icon: `char-images/${team}/${englishName}/${iconId}.webp`,
      }
    })
  } catch (error) {
    console.error('Error fetching style options:', error)
    return []
  }
}
