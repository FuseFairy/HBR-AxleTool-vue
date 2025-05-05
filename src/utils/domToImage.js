import piexif from 'piexifjs'
import { useCharStore } from '@/store/char'
import { useSkillStore } from '@/store/axle'
import { useSliderStore } from '@/store/slider'
import { useSettingStore } from '@/store/setting'
import { compressToBase64 } from 'lz-string'
import { getUsedTeams } from '@/utils/getUsedTeams'
import { isIosMobile } from './isMobile'
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
    const characters = charStore.selections[team]
    if (characters) {
      result[team] = Object.fromEntries(
        Object.entries(characters).map(([charName, charData]) => {
          const { skill, passiveSkill_value, character_info, commandSkill, ...restCharData } = charData
          return [charName, restCharData]
        })
      )
    }
    return result
  }, {})
  const axleName = skillStore.axleName.trim()

  const images = element.getElementsByTagName('img')
  const imageLoadPromises = Array.from(images).map((img) => {
    return new Promise((resolve) => {
      if (img.complete) {
        resolve()
      } else {
        img.onload = resolve
        img.onerror = resolve
      }
    })
  })

  try {
    const imageLoadTimeout = 5000
    await Promise.race([
      Promise.all(imageLoadPromises),
      new Promise((resolve) => setTimeout(resolve, imageLoadTimeout)),
    ])

    // trash ios!
    // more detail: https://github.com/tsayen/dom-to-image/issues/343
    if (isIosMobile()) {
      await domtoimage.toJpeg(element, {
        quality: 0.1,
        width: 1,
        height: 1,
      })
    }
    const dataUrl = await domtoimage.toJpeg(element, {
      quality: 1.0,
      backgroundColor: 'black',
      width: element.scrollWidth,
      height: element.scrollHeight,
    })

    const customData = {
      version: '1.0.0', // version of the save file format
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

    // 使用 Blob 和 URL.createObjectURL 替代直接的 Base64 字串
    const byteString = atob(jpegWithExifData.split(',')[1])
    const mimeString = jpegWithExifData.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: mimeString })
    const url = URL.createObjectURL(blob)

    // 創建下載鏈接並觸發下載
    const link = document.createElement('a')
    link.href = url
    link.download = `${axleName || 'hbr_axle'}.jpg`
    document.body.appendChild(link)
    link.click()

    // 清理 DOM 和記憶體
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // 顯式釋放大型變量
    delete window.dataUrl
    delete window.jpegWithExifData
  } catch (error) {
    throw error
  }
}
