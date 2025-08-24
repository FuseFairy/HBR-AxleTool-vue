import { fetchSkillOptions } from '@/utils/fetchSkillOptions'
import { fetchCharacterOptions } from '@/utils/fetchCharacterOptions'
import { fetchPassiveSkillOptions } from '@/utils/fetchPassiveSkillOptions'
import { fetchCommandSkill } from '@/utils/fetchCommandSkill'
import { fetchStyleOptions } from './fetchStyleOptions'
import { decompressFromBase64 } from 'lz-string'
import { find } from 'lodash-es'
import { useCharStore } from '@/store/char'
import { useSkillStore } from '@/store/axle'
import { useSliderStore } from '@/store/slider'
import { useLastTabStore } from '@/store/tab'
import { useSettingStore } from '@/store/setting'

function compareVersions(v1, v2) {
  const parts1 = String(v1 || '0')
    .split('.')
    .map(Number)
  const parts2 = String(v2 || '0')
    .split('.')
    .map(Number)
  const len = Math.max(parts1.length, parts2.length)
  for (let i = 0; i < len; i++) {
    const p1 = parts1[i] || 0
    const p2 = parts2[i] || 0
    if (p1 > p2) return 1
    if (p1 < p2) return -1
  }
  return 0
}

export async function decompressAxleData(customData) {
  let lastTabAssigned = false
  const charStore = useCharStore()
  const skillStore = useSkillStore()
  const sliderStore = useSliderStore()
  const lastTabStore = useLastTabStore()
  const settingStore = useSettingStore()

  const decodedData = JSON.parse(decompressFromBase64(customData))
  const dataVersion = decodedData?.version

  if (compareVersions(dataVersion, '1.0.0') < 0) {
    throw new Error('Old image not supported!')
  }

  const decodedDataChar = decodedData.char
  skillStore.axleId = ''

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

        const styleOptions = await fetchStyleOptions(character, teamName)
        const styleData = find(styleOptions, { value: style })
        if (styleData) {
          team[charKey]['style_id'] = styleData.id
        }
      }
    }
  }

  let skillsData = decodedData.skills
  if (compareVersions(dataVersion, '1.0.1') < 0) {
    // 遷移 skills 資料
    skillsData = decodedData.skills.map((row) =>
      row.map((skill) => {
        const newSkill = { ...skill }

        // 遷移 style_id
        if (newSkill.style && newSkill.selectedTab) {
          const charData = decodedDataChar[newSkill.selectedTab]
          if (charData) {
            const selection = Object.values(charData).find((sel) => sel.style === newSkill.style)
            newSkill.style_id = selection ? selection.style_id : null
          } else {
            newSkill.style_id = null
          }
        } else {
          newSkill.style_id = null
        }

        // 遷移 activeFormId
        if (newSkill.style_img) {
          try {
            const pathParts = newSkill.style_img.split('/')
            const fileName = pathParts.pop()
            newSkill.activeFormId = fileName.substring(0, fileName.lastIndexOf('.')) || fileName
          } catch (e) {
            console.error(`Failed to parse activeFormId from style_img: ${newSkill.style_img}`, e)
            newSkill.activeFormId = null
          }
        } else {
          newSkill.activeFormId = null
        }
        return newSkill
      })
    )
  }

  Object.assign(charStore.selections, decodedDataChar)
  Object.assign(skillStore, {
    axleName: decodedData.axleName ?? skillStore.axleName,
    skills: skillsData,
    turns: decodedData.turns,
  })
  skillStore.ensureIds()
  sliderStore.rows = decodedData.rows
  settingStore.lang = decodedData.language ?? settingStore.lang
}
