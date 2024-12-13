import domtoimage from 'dom-to-image-more'
import piexif from 'piexifjs'
import { useCharStore } from '@/stores/char_stores'
import { useSkillStore } from '@/stores/skill_stores'
import { useSliderStore } from '@/stores/slider_stores'
import { compressToBase64 } from 'lz-string';

export async function convertElementToPng(elementId) {
  const element = document.getElementById(elementId)
  const charStore = useCharStore()
  const skillStore = useSkillStore()
  const sliderStore = useSliderStore()

  if (element) {
    const width = element.scrollWidth
    const height = element.scrollHeight+10

    try {
      const pngDataUrl = await domtoimage.toPng(element, {
        width: width,
        height: height,
        style: {
          fontFamily: 'Noto Sans TC, sans-serif',
          backgroundColor: 'black',
          color: 'white'
        }
      })

      const img = new Image()
      img.src = pngDataUrl

      img.onload = async () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0)
        const jpegDataUrl = canvas.toDataURL('image/jpeg', 1.0)

        const customData = {
          char: charStore.selections,
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
        const jpegWithExifData = piexif.insert(exifBytes, jpegDataUrl)

        const jpegBase64 = jpegWithExifData.split(',')[1];
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${jpegBase64}`;
        link.download = 'HBR_Axle.jpg';

        // const buffer = jpegWithExifData.split(',')[1]
        // const byteCharacters = atob(buffer)
        // const byteNumbers = new Uint8Array(byteCharacters.length)
        // for (let i = 0; i < byteCharacters.length; i++) {
        //   byteNumbers[i] = byteCharacters.charCodeAt(i)
        // }

        // const blob = new Blob([byteNumbers], { type: 'image/jpeg' })
        // const link = document.createElement('a')
        // link.href = URL.createObjectURL(blob)
        // link.download = 'HBR_Axle.jpg'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Error generating or saving image:', error)
    }
  } else {
    console.error(`Element with ID "${elementId}" not found.`)
  }
}
