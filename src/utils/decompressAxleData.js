import { fetchSkillOptions } from '@/utils/fetchSkillOptions'
import { fetchCharacterOptions } from '@/utils/fetchCharacterOptions'
import { fetchPassiveSkillOptions } from '@/utils/fetchPassiveSkillOptions'
import { fetchCommandSkill } from '@/utils/fetchCommandSkill'
import { decompressFromBase64 } from 'lz-string'
import { find } from 'lodash-es'
import { useCharStore } from '@/store/char'
import { useSkillStore } from '@/store/axle'
import { useSliderStore } from '@/store/slider'
import { useLastTabStore } from '@/store/tab'
import { useSettingStore } from '@/store/setting'

const DATA_VERSION = '1.0.0'

export async function decompressAxleData(customData) {
  let lastTabAssigned = false
  const charStore = useCharStore()
  const skillStore = useSkillStore()
  const sliderStore = useSliderStore()
  const lastTabStore = useLastTabStore()
  const settingStore = useSettingStore()

  const decodedData = JSON.parse(decompressFromBase64(customData))

  if (decodedData?.version != DATA_VERSION) {
    throw new Error('Old image not supported!')
  }

  const decodedDataChar = decodedData.char

  for (const teamKey in decodedDataChar) {
    const team = decodedDataChar[teamKey]
    for (const charKey in team) {
      const { character, team: teamName, style } = team[charKey]
      if (style) {
        if (!lastTabAssigned) {
          lastTabStore.box_lastTab = parseInt(teamKey, 10)
          lastTabAssigned = true
        }
        team[charKey]['skill'] = await fetchSkillOptions(character, teamName, style)

        const charOptios = await fetchCharacterOptions(teamName)
        team[charKey]['character_info'] = find(charOptios, { value: character })

        const passiveSkillOptions = await fetchPassiveSkillOptions(character, teamName, style)
        team[charKey]['passiveSkill_value'] = passiveSkillOptions || []

        const commandSkill = await fetchCommandSkill(character, teamName, style)
        team[charKey]['commandSkill'] = commandSkill || []
      }
    }
  }

  Object.assign(charStore.selections, decodedDataChar)
  Object.assign(skillStore, {
    axleName: decodedData.axleName ?? skillStore.axleName,
    skills: decodedData.skills,
    turns: decodedData.turns,
  })
  skillStore.ensureIds()
  sliderStore.rows = decodedData.rows
  settingStore.lang = decodedData.language ?? settingStore.lang
}
