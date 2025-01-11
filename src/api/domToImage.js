import domtoimage from 'dom-to-image-more'
import piexif from 'piexifjs'
import { useCharStore } from '@/stores/char_stores'
import { useSkillStore } from '@/stores/skill_stores'
import { useSliderStore } from '@/stores/slider_stores'
import { compressToBase64 } from 'lz-string'
import { getUsedTeams } from '@/api/getUsedTeams'

async function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function dataUrlToBlob(dataUrl) {
  const byteString = atob(dataUrl.split(',')[1])
  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}

export async function convertElementToPng(elementId) {
  const element = document.getElementById(elementId)
  const charStore = useCharStore()
  const skillStore = useSkillStore()
  const sliderStore = useSliderStore()
  const usedTeams = getUsedTeams()
  const usedCharStore = usedTeams.reduce((result, team) => {
    if (team in charStore.selections) {
      result[team] = charStore.selections[team]
    }
    return result
  }, {})
  const axleName = skillStore.axleName.trimEnd()

  if (element) {
    const width = element.scrollWidth
    const height = element.scrollHeight

    try {
      const newCharStore = Object.fromEntries(
        Object.entries(usedCharStore).map(([key, value]) => [
          key,
          Object.fromEntries(
            Object.entries(value).map(([innerKey, innerValue]) => [
              innerKey,
              {
                ...innerValue,
                skill: []
              }
            ])
          )
        ])
      )

      const pngDataUrl = await domtoimage.toPng(element, {
        width: width,
        height: height,
      })

      const img = new Image()
      img.src = pngDataUrl

      img.onload = async () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              console.error('Failed to create blob from canvas.')
              return
            }
            const customData = {
              char: newCharStore,
              axleName: axleName,
              skills: skillStore.skills,
              turns: skillStore.turns,
              rows: sliderStore.rows
            }

            const jsonString = JSON.stringify(customData)
            const compressedData = compressToBase64(jsonString)

            const exif = {}
            exif[piexif.ExifIFD.UserComment] = compressedData

            const exifObj = { Exif: exif }
            const exifBytes = piexif.dump(exifObj)
            const jpegWithExifData = piexif.insert(exifBytes, await blobToDataUrl(blob))

            const finalBlob = dataUrlToBlob(jpegWithExifData)

            const link = document.createElement('a')
            link.href = URL.createObjectURL(finalBlob)
            link.download = `${axleName || 'hbr_axle'}.jpg`;
            document.body.appendChild(link)
            link.click()

            setTimeout(() => {
              document.body.removeChild(link)
              URL.revokeObjectURL(link.href)
            }, 100)
          },
          'image/jpeg',
          1.0
        )
      }
    } catch (error) {
      console.error('Error generating or saving image:', error)
    }
  } else {
    console.error(`Element with ID "${elementId}" not found.`)
  }
}
