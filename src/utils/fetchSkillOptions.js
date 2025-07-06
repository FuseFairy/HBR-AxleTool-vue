import { getTeamData } from './getTeamData'

export async function fetchSkillOptions(characterName, team, styleName) {
  try {
    const data = await getTeamData(team)
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
      批判性思考: {
        value: '批判性思考',
        names: { 'zh-TW': '批判性思考', jp: 'クリティカルシンキング', 'zh-CN': '批判性思考', 'zh-CN-CN': '批判性思考' },
        sp: 5,
      },
      修復之光: {
        value: '修復之光',
        names: { 'zh-TW': '修復之光', jp: 'リペアライト', 'zh-CN': '修复之光', 'zh-CN-CN': '修复之光' },
        sp: 9,
      },
      DRIVE增幅: {
        value: 'DRIVE增幅',
        names: { 'zh-TW': 'DRIVE增幅', jp: 'ドライブゲイン', 'zh-CN': 'DRIVE增幅', 'zh-CN-CN': 'DRIVE增幅' },
        sp: 6,
      },
      防護罩: {
        value: '防護罩',
        names: { 'zh-TW': '防護罩', jp: 'プロテクション', 'zh-CN': '防护罩', 'zh-CN-CN': '防护罩' },
        sp: 0,
      },
      進攻上升: {
        value: '進攻上升',
        names: { 'zh-TW': '進攻上升', jp: 'アタックライズ', 'zh-CN': '进攻上升', 'zh-CN-CN': '进攻上升' },
        sp: 4,
      },
      專注力: {
        value: '專注力',
        names: { 'zh-TW': '專注力', jp: 'コンセントレーション', 'zh-CN': '专注力', 'zh-CN-CN': '专注力' },
        sp: 4,
      },
      重點保養: {
        value: '重點保養',
        names: { 'zh-TW': '重點保養', jp: 'ポイントケア', 'zh-CN': '重点保养', 'zh-CN-CN': '重点保养' },
        sp: 1,
      },
      自我療癒: {
        value: '自我療癒',
        names: { 'zh-TW': '自我療癒', jp: 'セルフエイド', 'zh-CN': '自我疗愈', 'zh-CN-CN': '自我疗愈' },
        sp: 4,
      },
      軟化: {
        value: '軟化',
        names: { 'zh-TW': '軟化', jp: 'ソフニング', 'zh-CN': '软化', 'zh-CN-CN': '软化' },
        sp: 9,
      },
      衰減之力: {
        value: '衰減之力',
        names: { 'zh-TW': '衰減之力', jp: 'ウィークンパワー', 'zh-CN': '衰减之力', 'zh-CN-CN': '衰减之力' },
        sp: 6,
      },
      火焰重力子: {
        value: '火焰重力子',
        names: { 'zh-TW': '火焰重力子', jp: 'ファイアグラビトン', 'zh-CN': '火焰重力子', 'zh-CN-CN': '火焰重力子' },
        sp: 6,
      },
      雷霆重力子: {
        value: '雷霆重力子',
        names: { 'zh-TW': '雷霆重力子', jp: 'サンダーグラビトン', 'zh-CN': '雷霆重力子', 'zh-CN-CN': '雷霆重力子' },
        sp: 6,
      },
      暗黑重力子: {
        value: '暗黑重力子',
        names: { 'zh-TW': '暗黑重力子', jp: 'ダークグラビトン', 'zh-CN': '暗黑重力子', 'zh-CN-CN': '暗黑重力子' },
        sp: 6,
      },
      光明重力子: {
        value: '光明重力子',
        names: { 'zh-TW': '光明重力子', jp: 'ライトグラビトン', 'zh-CN': '光明重力子', 'zh-CN-CN': '光明重力子' },
        sp: 6,
      },
      寒冰重力子: {
        value: '寒冰重力子',
        names: { 'zh-TW': '寒冰重力子', jp: 'アイスグラビトン', 'zh-CN': '寒冰重力子', 'zh-CN-CN': '寒冰重力子' },
        sp: 6,
      },
    }

    const allSkills = [
      ...Object.entries(specificSkills).map(([, info]) => ({
        value: info['value'],
        names: info['names'],
        sp: info['sp'],
      })),
      ...Object.entries(commonSkills).map(([, info]) => ({
        value: info['value'],
        names: info['names'],
        sp: info['sp'],
      })),
      ...Object.entries(universalSkills).map(([, info]) => ({
        value: info['value'],
        names: info['names'],
        sp: info['sp'],
      })),
    ]
    return allSkills
  } catch (error) {
    console.error('Error fetching skill options:', error)
    return []
  }
}
