import { getTeamData } from '@/utils/state-getters/getTeamData'

export async function fetchCharacterOptions(team) {
  try {
    const data = await getTeamData(team)

    return Object.entries(data).map(([, info]) => ({
      value: info.value,
      names: info.names,
      icon: `char-images/${team}/${info['english name']}/icon.webp`,
    }))
  } catch (error) {
    console.error('Error fetching character options:', error)
    return []
  }
}
