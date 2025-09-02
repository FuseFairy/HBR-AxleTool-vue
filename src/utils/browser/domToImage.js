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
    const rect = element.getBoundingClientRect()
    const options = {
      embedFonts: true,
      backgroundColor: 'black',
      width: rect.width,
      height: rect.height,
    }

    // eslint-disable-next-line no-unused-vars
    const _ = await snapdom.toCanvas(element, {
      embedFonts: true,
      width: 1,
      height: 1,
      cache: 'disabled',
    })
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
