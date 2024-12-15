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
    const height = element.scrollHeight

    try {
      const newCharStore = Object.fromEntries(
        Object.entries(charStore.selections).map(([key, value]) => [
            key,
            Object.fromEntries(
                Object.entries(value).map(([innerKey, innerValue]) => [
                    innerKey,
                    {
                        ...innerValue,
                        skill: [],
                    },
                ])
            ),
        ])
      );

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
        await new Promise(resolve => setTimeout(resolve, 50));
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0)
        const jpegDataUrl = canvas.toDataURL('image/jpeg', 1.0)

        const customData = {
          char: newCharStore,
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
        const binary = atob(jpegBase64);
        const array = Uint8Array.from(binary, char => char.charCodeAt(0));
        const blob = new Blob([array], { type: 'image/jpeg' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'HBR_Axle.jpg';
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        }, 100);
      }
    } catch (error) {
      console.error('Error generating or saving image:', error)
    }
  } else {
    console.error(`Element with ID "${elementId}" not found.`)
  }
}
