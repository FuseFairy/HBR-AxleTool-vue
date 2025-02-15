import axios from 'axios'
import { getAssetsFile } from './util'

export async function fetchSkillOptions(characterName, team, styleName) {
  try {
    const response = await axios.get(getAssetsFile(`char_data/${team}.json`))
    const data = response.data
    const characterData = data[characterName]

    if (!characterData || !characterData.style) {
      throw new Error('Character data or styles not found')
    }

    const commonSkills = characterData.skill.common || {}
    const specificSkills = Object.fromEntries(
      Object.entries(characterData.skill[styleName] || {}).filter(
        ([key]) => key !== 'command action' && key !== 'passive skill'
      )
    )
    const universalSkills = {
      "批判性思考": {
        "value": "批判性思考",
        "names": { "zh-TW": "批判性思考", "jp": "クリティカルシンキング" },
        "sp": 5
      },
      "修復之光": {
        "value": "修復之光",
        "names": { "zh-TW": "修復之光", "jp": "リペアライト" },
        "sp": 9
      },
      "DRIVE增幅": {
        "value": "DRIVE增幅",
        "names": { "zh-TW": "DRIVE增幅", "jp": "ドライブゲイン" },
        "sp": 6
      },
      "防護罩": {
        "value": "防護罩",
        "names": { "zh-TW": "防護罩", "jp": "プロテクション" },
        "sp": 0
      },
      "進攻上升": {
        "value": "進攻上升",
        "names": { "zh-TW": "進攻上升", "jp": "アタックライズ" },
        "sp": 4
      },
      "專注力": {
        "value": "專注力",
        "names": { "zh-TW": "專注力", "jp": "コンセントレーション" },
        "sp": 4
      },
      "重點保養": {
        "value": "重點保養",
        "names": { "zh-TW": "重點保養", "jp": "ポイントケア" },
        "sp": 1
      },
      "自我療癒": {
        "value": "自我療癒",
        "names": { "zh-TW": "自我療癒", "jp": "セルフエイド" },
        "sp": 4
      },
      "軟化": {
        "value": "軟化",
        "names": { "zh-TW": "軟化", "jp": "ソフニング" },
        "sp": 9
      },
      "衰減之力": {
        "value": "衰減之力",
        "names": { "zh-TW": "衰減之力", "jp": "ウィークンパワー" },
        "sp": 6
      },
      "火焰重力子": {
        "value": "火焰重力子",
        "names": { "zh-TW": "火焰重力子", "jp": "ファイアグラビトン" },
        "sp": 6
      },
      "雷霆重力子": {
        "value": "雷霆重力子",
        "names": { "zh-TW": "雷霆重力子", "jp": "サンダーグラビトン" },
        "sp": 6
      },
      "暗黑重力子": {
        "value": "暗黑重力子",
        "names": { "zh-TW": "暗黑重力子", "jp": "ダークグラビトン" },
        "sp": 6
      },
      "光明重力子": {
        "value": "光明重力子",
        "names": { "zh-TW": "光明重力子", "jp": "ライトグラビトン" },
        "sp": 6
      },
      "寒冰重力子": {
        "value": "寒冰重力子",
        "names": { "zh-TW": "寒冰重力子", "jp": "アイスグラビトン" },
        "sp": 6
      }
    }
    
    
    const allSkills = [
      ...Object.entries(specificSkills).map(([_, info]) => ({ "value": info["value"], "names": info["names"], "sp": info["sp"] })),
      ...Object.entries(commonSkills).map(([_, info]) => ({ "value": info["value"], "names": info["names"], "sp": info["sp"]})),
      ...Object.entries(universalSkills).map(([_, info]) => ({ "value": info["value"], "names": info["names"], "sp": info["sp"] }))
    ]
    return allSkills
  } catch (error) {
    console.error('Error fetching skill options:', error)
    return []
  }
}
