<script setup>
import { ref } from 'vue'
import piexif from 'piexifjs'
import { useCharStore } from '@/stores/char_stores'
import { useSkillStore } from '@/stores/skill_stores'
import { useSliderStore } from '@/stores/slider_stores'
import { useLastTabStore } from '@/stores/lastTab_stores'
import { useSettingStore } from '@/stores/setting_stores'
import { fetchSkillOptions } from '@/scripts/skillOptions'
import { fetchCharacterOptions } from '@/scripts/charData'
import { fetchPassiveSkillOptions } from '@/scripts/passiveSkillOptions'
import { fetchCommandSkill } from '@/scripts/commandSkill'
import { decompressFromBase64 } from 'lz-string'
import loading from 'vue-loading-overlay'
import _find from 'lodash-es/find'

const charStore = useCharStore()
const skillStore = useSkillStore()
const sliderStore = useSliderStore()
const lastTabStore = useLastTabStore()
const fileInput = ref(null)
const isLoading = ref(false)
const fullPage = ref(true)

const triggerFileInput = () => fileInput.value.click()

const updateSelections = async (decodedDataChar) => {
  let lastTabAssigned = false

  for (const teamKey in decodedDataChar) {
    const team = decodedDataChar[teamKey]

    for (const charKey in team) {
      const { character, team: teamName, style } = team[charKey]

      if (style) {
        if (!lastTabAssigned) {
          lastTabStore.box_lastTab = parseInt(teamKey, 10)
          lastTabAssigned = true
        }
        team[charKey]['skill'] = await fetchSkillOptions(character, teamName, style)

        const charOptios = await fetchCharacterOptions(teamName)
        team[charKey]['character_info'] = _find(charOptios, { value: character })

        const passiveSkillOptions = await fetchPassiveSkillOptions(character, teamName, style)
        team[charKey]['passiveSkill_value'] = passiveSkillOptions || []
        
        const commandSkill = await fetchCommandSkill(character, teamName, style)
        team[charKey]['commandSkill'] = commandSkill || [];
      }
    }
  }
  return decodedDataChar
}

function mergeSelections(charStoreSelections, updatedSelections) {
  Object.entries(charStoreSelections).forEach(([teamKey, teamValue]) => {
    Object.entries(teamValue).forEach(([charKey, charValue]) => {
      Object.assign(charValue, updatedSelections?.[teamKey]?.[charKey] ?? {});
    });
  });
}

const onFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file || !['image/jpeg', 'image/jpg'].includes(file.type)) {
    alert('Please upload a JPEG image file!');
    return;
  }

  try {
    isLoading.value = true;
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;

        let binaryString = '';
        const bytes = new Uint8Array(arrayBuffer);
        const length = bytes.byteLength;
        for (let i = 0; i < length; i++) {
          binaryString += String.fromCharCode(bytes[i]);
        }

        const exifObj = piexif.load(binaryString);
        const customData = exifObj['Exif'][piexif.ExifIFD.UserComment] || '';
        const settingStore = useSettingStore();

        if (!customData) {
          throw new Error('Custom metadata not found.');
        }

        const decodedData = JSON.parse(decompressFromBase64(customData));
        const updatedSelections = await updateSelections(decodedData.char);

        mergeSelections(charStore.selections, updatedSelections);
        Object.assign(skillStore, {
          axleName: decodedData.axleName ?? skillStore.axleName,
          skills: decodedData.skills,
          turns: decodedData.turns,
        });
        sliderStore.rows = decodedData.rows;
        settingStore.lang = decodedData.language ?? settingStore.lang;
      } catch (error) {
        console.error('Error reading image or parsing metadata:', error);
        alert('Invalid JPEG file format or failed to parse metadata. Please check the file integrity and format.');
      } finally {
        event.target.value = '';
        isLoading.value = false;
      }
    };
  } catch (error) {
    console.error('Error reading file:', error);
    alert('Failed to read the file. Please try again.');
  }
};
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
  <button @click="triggerFileInput" class="upload-button" v-tooltip="{ content: 'Upload', placement: 'bottom' }">
    <img src="@/assets/custom_icon/upload.svg" alt="Upload" />
  </button>
  <input type="file" ref="fileInput" @change="onFileChange" accept=".jpg,.jpeg" style="display: none" />
</template>

<style scoped>
.upload-button {
  background-color: transparent;
  padding: 4px;
  border: none;
  height: 36px;
  width: 36px;
  cursor: pointer;
  border-radius: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
}
.upload-button:hover {
  background-color: rgba(78, 69, 69, 0.3);
}
</style>
