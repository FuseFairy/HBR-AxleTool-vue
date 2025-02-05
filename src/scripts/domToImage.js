import piexif from 'piexifjs'
import { useCharStore } from '@/stores/char_stores'
import { useSkillStore } from '@/stores/skill_stores'
import { useSliderStore } from '@/stores/slider_stores'
import { compressToBase64 } from 'lz-string'
import { getUsedTeams } from '@/scripts/getUsedTeams'
import domtoimage from 'dom-to-image-more'

export async function convertElementToJpg(elementId) {
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
    try {
      const newCharStore = Object.fromEntries(
        Object.entries(usedCharStore).map(([team, characters]) => [
          team,
          Object.fromEntries(
            Object.entries(characters).map(([charName, charData]) => [
              charName,
              { ...charData, skill: [] }
            ])
          )
        ])
      );      

      const dataUrl = await domtoimage.toJpeg(element, {
        quality: 1.0,
        backgroundColor: 'black',
        cacheBust: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const customData = {
        char: newCharStore,
        axleName: axleName,
        skills: skillStore.skills,
        turns: skillStore.turns,
        rows: sliderStore.rows
      };

      const jsonString = JSON.stringify(customData);
      const compressedData = compressToBase64(jsonString);

      const exif = {};
      exif[piexif.ExifIFD.UserComment] = compressedData;

      const exifObj = { Exif: exif };
      const exifBytes = piexif.dump(exifObj);
      const jpegWithExifData = piexif.insert(exifBytes, dataUrl);

      const link = document.createElement('a');
      link.href = jpegWithExifData;
      link.download = `${axleName || 'hbr_axle'}.jpg`;
      link.click();
    } catch (error) {
      console.error('Error generating or saving image:', error)
    }
  } else {
    console.error(`Element with ID "${elementId}" not found.`)
  }
}
