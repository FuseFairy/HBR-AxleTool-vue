import piexif from 'piexifjs'
import { useSkillStore } from '@/store/axle'
import { compressAxleData } from '@/utils/axle/compressAxleData'
import { snapdom } from '@zumer/snapdom'
import { isMobile } from '@/utils/browser/deviceDetector'

export async function convertElementToJpg(elementId) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`)
    return
  }

  const skillStore = useSkillStore()
  const axleName = skillStore.axleName.trim()

  try {
    const rect = element.getBoundingClientRect()
    const options = {
      embedFonts: true,
      backgroundColor: 'black',
      width: rect.width,
      height: rect.height,
      dpr: isMobile() ? 1 : window.devicePixelRatio,
      scale: isMobile() ? 1.2 : 1,
    }

    // WORKAROUND: Force-clear snapdom's cache before the actual capture.
    // A single call with `cache: 'disabled'` was not reliable. This two-step process ensures
    // that all stale assets are flushed by the first call, guaranteeing the second
    // call captures the latest DOM state accurately.

    // 1. Sacrificial call to clear caches. The result is intentionally ignored.
    // eslint-disable-next-line no-unused-vars
    const _ = await snapdom.toCanvas(element, {
      embedFonts: true,
      width: 1,
      height: 1,
      dpr: 1,
      cache: 'disabled',
    })

    // 2. The actual capture, now running with a clean cache.
    const canvas = await snapdom.toCanvas(element, options)

    const dataUrl = canvas.toDataURL('image/jpeg', 1)
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
