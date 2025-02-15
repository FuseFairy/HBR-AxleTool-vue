import piexif from 'piexifjs'
import { useCharStore } from '@/stores/char_stores'
import { useSkillStore } from '@/stores/skill_stores'
import { useSliderStore } from '@/stores/slider_stores'
import { useSettingStore } from '@/stores/setting_stores'
import { compressToBase64 } from 'lz-string'
import { getUsedTeams } from '@/scripts/getUsedTeams'
import domtoimage from 'dom-to-image-more'

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

  const usedCharStore = usedTeams.reduce((result, team) => {
    const characters = charStore.selections[team];
    if (characters) {
      result[team] = Object.fromEntries(
        Object.entries(characters).map(([charName, charData]) => {
          const { skill, passiveSkill_value, character_info, commandSkill, ...restCharData } = charData;
          return [charName, restCharData];
        })
      );
    }
    return result;
  }, {});
  const axleName = skillStore.axleName.trim()

  const images = element.getElementsByTagName('img')
  const imageLoadPromises = Array.from(images).map(img => {
    return new Promise(resolve => {
      if (img.complete) {
        resolve()
      } else {
        img.onload = resolve
        img.onerror = resolve
      }
    })
  })

  try {
    await Promise.all(imageLoadPromises)

    const dataUrl = await domtoimage.toJpeg(element, {
      quality: 1.0,
      backgroundColor: 'black',
      cacheBust: true,
      width: element.scrollWidth,
      height: element.scrollHeight,
    })

    const customData = {
      char: usedCharStore,
      axleName: axleName,
      skills: skillStore.skills,
      turns: skillStore.turns,
      rows: sliderStore.rows,
      language: settingStore.lang
    }

    const jsonString = JSON.stringify(customData)
    const compressedData = compressToBase64(jsonString)
    const exif = {
      [piexif.ExifIFD.UserComment]: compressedData,
    }

    const exifObj = { Exif: exif }
    const exifBytes = piexif.dump(exifObj)
    const jpegWithExifData = piexif.insert(exifBytes, dataUrl)

    const link = document.createElement('a')
    link.href = jpegWithExifData
    link.download = `${axleName || 'hbr_axle'}.jpg`
    link.click()

  } catch (error) {
    throw error;
  }
}
