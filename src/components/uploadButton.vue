<script setup>
import { ref } from 'vue'
import piexif from 'piexifjs'
import { useCharStore } from '@/stores/char_stores'
import { useSkillStore } from '@/stores/skill_stores'
import { useSliderStore } from '@/stores/slider_stores'
import { useLastTabStore } from '@/stores/lastTab_stores'
import { fetchSkillOptions } from '@/scripts/skillOptions'
import { decompressFromBase64 } from 'lz-string'
import loading from 'vue-loading-overlay'

const charStore = useCharStore()
const skillStore = useSkillStore()
const sliderStore = useSliderStore()
const lastTabStore = useLastTabStore()
const fileInput = ref(null)
const isLoading = ref(false)
const fullPage = ref(true)
const isUploading = ref(false)

const triggerFileInput = () => {
  fileInput.value.click()
}

async function updateSelections(decodedDataChar) {
  let lastTabAssigned = false;

  for (const teamKey in decodedDataChar) {
    const Team = decodedDataChar[teamKey];
    
    for (const charKey in Team) {
      const { character, team, style } = Team[charKey];
      
      if (style && !lastTabAssigned) {
        lastTabStore.box_lastTab = parseInt(teamKey, 10);
        lastTabAssigned = true;
      }

      if (style) {
        const skillOptions = await fetchSkillOptions(character, team, style);
        decodedDataChar[teamKey][charKey]['skill'] = skillOptions;
      }
    }
  }

  return decodedDataChar;
}

const onFileChange = async (event) => {
  isUploading.value = true
  const file = event.target.files[0]
  if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        isLoading.value = true
        const jpegDataUrl = e.target.result
        const exifObj = piexif.load(jpegDataUrl)
        const customData = exifObj['Exif'][piexif.ExifIFD.UserComment] || ''

        if (customData) {
          const jsonString = decompressFromBase64(customData)
          const decodedData = JSON.parse(jsonString)
          const decodedDataUpdate = await updateSelections(decodedData.char)
          Object.keys(decodedDataUpdate).forEach((key) => {
            charStore.selections[key] = decodedDataUpdate[key]
          })
          if (decodedData.axleName !== undefined) {
            skillStore.axleName = decodedData.axleName;
          }
          skillStore.skills = decodedData.skills
          skillStore.turns = decodedData.turns
          sliderStore.rows = decodedData.rows
        } else {
          console.error('Custom metadata not found')
          alert('Custom metadata not found. Please check the file.')
        }
      } catch (error) {
        console.error('Error reading image or parsing parameters:', error)
        alert(
          'The uploaded JPEG file format is incorrect or parameter parsing failed. Please check if the file is corrupted or if the parameter format is correct.'
        )
      } finally {
        event.target.value = ''
        isLoading.value = false
        isUploading.value = false
      }
    }

    reader.readAsDataURL(file)
  } else {
    alert('Please upload a JPEG formatted image!')
  }
}
</script>

<template>
  <loading
    v-model:active="isLoading"
    :can-cancel="false"
    :is-full-page="fullPage"
    :lock-scroll="true"
    background-color="#54504b"
    loader="dots"
    color="#79d1cb"
  />
  <button @click="triggerFileInput" class="upload-button" v-tooltip="{ content: 'upload', placement: 'bottom', disabled: isUploading }">
    <img src="@/assets/custom_icon/upload.svg" alt="upload" />
  </button>
  <input
    type="file"
    ref="fileInput"
    @change="onFileChange"
    accept=".jpg,.jpeg"
    style="display: none"
  />
</template>

<style scoped>
.upload-button {
  background-color: transparent;
  padding: 1px;
  border: none;
  box-sizing: border-box;
  height: 32px;
  width: 32px;
  cursor: pointer;
  border-radius: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.upload-button:hover {
  background-color: rgba(78, 69, 69, 0.3);
}
</style>
