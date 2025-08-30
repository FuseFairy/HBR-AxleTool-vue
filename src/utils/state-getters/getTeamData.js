import { getAssetsFile } from '@/utils/assets/getAssetsFile'

export async function getTeamData(team) {
  try {
    const response = await fetch(getAssetsFile(`char-data/${team}.json`))
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error loading team data for "${team}":`, error)
    return null
  }
}
