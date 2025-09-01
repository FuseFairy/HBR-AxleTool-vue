import piexif from 'piexifjs'
import { useSkillStore } from '@/store/axle'
import { compressAxleData } from '@/utils/axle/compressAxleData'
import { snapdom } from '@zumer/snapdom'

export async function convertElementToJpg(elementId) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`)
    return
  }

  const skillStore = useSkillStore()
  const axleName = skillStore.axleName.trim()

  try {
    const options = {
      embedFonts: true,
      localFonts: [
        { family: 'Gugi', src: '@/assets/fonts/Gugi.woff2' },
        { family: 'Xiaolai', src: '@/assets/fonts/XiaolaiMonoSC-Regular.woff2' },
        { family: 'LXGW WenKai Mono TC', src: '@/assets/fonts/LXGWWenKaiMonoTC-Regular.woff2' },
      ],
      quality: 1.0,
      backgroundColor: 'black',
      width: element.scrollWidth,
      height: element.scrollHeight,
    }

    const canvas = await snapdom.toCanvas(element, options)
    const dataUrl = canvas.toDataURL('image/jpeg', options.quality)

    const compressedData = compressAxleData()
    const exif = {
      [piexif.ExifIFD.UserComment]: compressedData,
    }

    const exifObj = { Exif: exif }
    const exifBytes = piexif.dump(exifObj)
    const jpegWithExifData = piexif.insert(exifBytes, dataUrl)

    const link = document.createElement('a')
    link.href = jpegWithExifData
    link.download = `${axleName || 'hbr axle'}.jpg`
    link.click()
  } catch (error) {
    console.error('Error during JPG conversion:', error)
    throw error
  }
}
