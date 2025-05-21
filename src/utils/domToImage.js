import piexif from 'piexifjs'
import { useCharStore } from '@/store/char'
import { useSkillStore } from '@/store/axle'
import { useSliderStore } from '@/store/slider'
import { useSettingStore } from '@/store/setting'
import { compressToBase64 } from 'lz-string'
import { getUsedTeams } from '@/utils/getUsedTeams'
import { isIosMobile } from './isMobile'
import domtoimage from 'dom-to-image-more'

const DATA_VERSION = '1.0.0'

export async function convertElementToJpg(elementId) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`)
    return
  }

  const charStore = useCharStore()
  const skillStore = useSkillStore()
  const sliderStore = useSliderStore()
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

  try {
    let dataUrl = ''

    // trash ios!
    // more detail: https://github.com/tsayen/dom-to-image/issues/343
    if (isIosMobile()) {
      await domtoimage.toJpeg(element, {
        quality: 0.1,
        width: 1,
        height: 1,
      })
    }
    dataUrl = await domtoimage.toJpeg(element, {
      quality: 1.0,
      backgroundColor: 'black',
      width: element.scrollWidth,
      height: element.scrollHeight,
    })
    // else {
    //   const pixelRatio = window.devicePixelRatio || 1
    //   dataUrl = await domtoimage.toJpeg(element, {
    //     quality: 1.0,
    //     backgroundColor: 'black',
    //     width: element.scrollWidth,
    //     height: element.scrollHeight,
    //     scale: pixelRatio
    //   })
    // }
    const customData = {
      version: DATA_VERSION, // version of the save file format
      char: usedCharStore,
      axleName: axleName,
      skills: skillStore.skills,
      turns: skillStore.turns,
      rows: sliderStore.rows,
      language: settingStore.lang,
    }

    const jsonString = JSON.stringify(customData)
    const compressedData = compressToBase64(jsonString)
    const exif = {
      [piexif.ExifIFD.UserComment]: compressedData,
    }

    const exifObj = { Exif: exif }
    const exifBytes = piexif.dump(exifObj)
    const jpegWithExifData = piexif.insert(exifBytes, dataUrl)

    // Trigger download directly with Data URL
    const link = document.createElement('a')
    link.href = jpegWithExifData
    link.download = `${axleName || 'hbr axle'}.jpg`
    link.click()
  } catch (error) {
    throw error
  }
}
