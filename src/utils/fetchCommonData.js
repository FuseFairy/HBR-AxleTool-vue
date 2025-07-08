import { getAssetsFile } from '@/utils/getAssetsFile'

let commonDataCache = null

export async function fetchCommonData() {
  if (!commonDataCache) {
    try {
      const response = await fetch(getAssetsFile('char-data/common_skills.json'))
      commonDataCache = await response.json()
    } catch (error) {
      console.error('Error fetch common_skills.json:', error)
      commonDataCache = { defaultCommandSkill: [], universalSkills: [] } // Fallback
    }
  }
  return commonDataCache
}
