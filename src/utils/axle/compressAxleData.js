import { useCharStore } from '@/store/char'
import { useSkillStore } from '@/store/axle'
import { useUiStore } from '@/store/ui'
import { useSettingStore } from '@/store/setting'
import { compressToBase64 } from 'lz-string'
import { getUsedTeams } from '@/utils/state-getters/getUsedTeams'
import { version } from '/package.json'

export function compressAxleData() {
  const charStore = useCharStore()
  const skillStore = useSkillStore()
  const uiStore = useUiStore()
  const settingStore = useSettingStore()
  const usedTeams = getUsedTeams()
  const axleName = skillStore.axleName.trim()
  const usedCharStore = {}

  for (const team of usedTeams) {
    const characters = charStore.selections[team]
    if (characters) {
      const teamData = {}
      for (const [charName, charData] of Object.entries(characters)) {
        const filteredData = { ...charData }
        delete filteredData.skill
        delete filteredData.passiveSkill_value
        delete filteredData.character_info
        delete filteredData.commandSkill
        teamData[charName] = filteredData
      }
      usedCharStore[team] = teamData
    }
  }

  const customData = {
    version: version, // version of the save file format
    char: usedCharStore,
    axleName: axleName,
    skills: skillStore.skills,
    // eslint-disable-next-line no-unused-vars
    turns: skillStore.turns.map(({ id, ...rest }) => rest),
    rows: uiStore.sliderRows,
    language: settingStore.lang,
  }

  const jsonString = JSON.stringify(customData)
  const compressedData = compressToBase64(jsonString)

  return compressedData
}
