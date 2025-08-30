import piexif from 'piexifjs'
import { useSkillStore } from '@/store/axle'
import { compressAxleData } from '@/utils/axle/compressAxleData'
import { isDesktop } from '@tenrok/vue3-device-detect'
import workerUrl from 'modern-screenshot/worker?url'
import { createContext, destroyContext, domToDataUrl } from 'modern-screenshot'

export async function convertElementToJpg(elementId, useWebWorker = false) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`)
    return
  }

  const skillStore = useSkillStore()
  const axleName = skillStore.axleName.trim()

  let context = null
  try {
    let dataUrl = ''
    const pixelRatio = isDesktop ? window.devicePixelRatio : 1
    const options = {
      quality: 1.0,
      backgroundColor: 'black',
      width: element.scrollWidth,
      height: element.scrollHeight,
      type: 'image/jpeg',
      scale: pixelRatio,
    }

    if (useWebWorker) {
      context = await createContext(element, {
        ...options,
        workerUrl,
        workerNumber: 1,
      })
      dataUrl = await domToDataUrl(context)
    } else {
      dataUrl = await domToDataUrl(element, options)
    }

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
  } finally {
    if (context) {
      destroyContext(context)
    }
  }
}
