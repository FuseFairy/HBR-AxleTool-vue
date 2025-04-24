<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import Multiselect from '@vueform/multiselect'
import { useCharStore } from '@/store/char'
import { useSliderStore } from '@/store/slider'
import { useSkillStore } from '@/store/axle'
import { fetchCharacterOptions } from '@/utils/fetchCharacterOptions'
import { fetchStyleOptions } from '@/utils/fetchStyleOptions'
import { fetchSkillOptions } from '@/utils/fetchSkillOptions'
import { fetchPassiveSkillOptions } from '@/utils/fetchPassiveSkillOptions'
import { getAssetsFile } from '@/utils/getAssetsFile'
import { fetchCommandSkill } from '@/utils/fetchCommandSkill'
import { isMobile } from '@/utils/isMobile'
import { useSettingStore } from '@/store/setting'
import { Collapse } from 'vue-collapsed'
import { find } from 'lodash-es'

const charStore = useCharStore()
const sliderStore = useSliderStore()
const settingStore = useSettingStore()
const skillStore = useSkillStore()

const props = defineProps({
  buttonKey: {
    type: Number,
    required: true,
  },
  selectedTab: {
    type: Number,
    required: true,
  },
})

const teamOptions = [
  { value: '30G', name: '30G', icon: 'team-icon/30G.webp' },
  { value: '31A', name: '31A', icon: 'team-icon/31A.webp' },
  { value: '31B', name: '31B', icon: 'team-icon/31B.webp' },
  { value: '31C', name: '31C', icon: 'team-icon/31C.webp' },
  { value: '31D', name: '31D', icon: 'team-icon/31D.webp' },
  { value: '31E', name: '31E', icon: 'team-icon/31E.webp' },
  { value: '31F', name: '31F', icon: 'team-icon/31F.webp' },
  { value: '31X', name: '31X', icon: 'team-icon/31X.webp' },
  { value: '31AB', name: 'Angel Beats!', icon: 'team-icon/Angel Beats.webp' },
  { value: 'Command', name: '司令部', icon: 'team-icon/Command.webp' },
]
const earringOptions = [
  {
    value: 'BREAK耳環',
    names: { 'zh-TW': 'BREAK耳環', jp: 'ブレイクピアス', 'zh-CN': 'BREAK耳环' },
    icon: 'earring-icon/break.webp',
  },
  {
    value: '進攻耳環',
    names: { 'zh-TW': '進攻耳環', jp: 'アタックピアス', 'zh-CN': '进攻耳环' },
    icon: 'earring-icon/attach.webp',
  },
  {
    value: 'DRIVE耳環',
    names: { 'zh-TW': 'DRIVE耳環', jp: 'ドライブピアス', 'zh-CN': 'DRIVE耳环' },
    icon: 'earring-icon/drive.webp',
  },
  {
    value: '爆破耳環',
    names: { 'zh-TW': '爆破耳環', jp: 'ブラストピアス', 'zh-CN': '爆破耳环' },
    icon: 'earring-icon/explosion.webp',
  },
]
const spiritualOptions = [
  { value: '1', name: '+1' },
  { value: '2', name: '+2' },
  { value: '3', name: '+3' },
  { value: '4', name: '+4' },
  { value: '5', name: '+5' },
]
const rankOptions = Array.from({ length: 10 }, (_, i) => i + 1)
const characterOptions = ref([])
const styleOptions = ref([])
const passiveSkillOptions = ref([])
const isExpandedCollapse = ref(false)

const selectedTeam = ref(charStore.getSelection(props.buttonKey, 'team', props.selectedTab))
const selectedCharacter = ref(charStore.getSelection(props.buttonKey, 'character', props.selectedTab))
const selectedStyle = ref(charStore.getSelection(props.buttonKey, 'style', props.selectedTab))
const selectedEarring = ref(charStore.getSelection(props.buttonKey, 'earring', props.selectedTab))
const selectedRank = ref(charStore.getSelection(props.buttonKey, 'rank', props.selectedTab))
const selectedFlower = ref(charStore.getSelection(props.buttonKey, 'flower', props.selectedTab))
const selectedPassiveSkill = ref(charStore.getSelection(props.buttonKey, 'passiveSkill', props.selectedTab))

const isCharDisabled = computed(() => !selectedTeam.value)
const isStyleDisabled = computed(() => !selectedCharacter.value)
const isOtherDisable = computed(() => !selectedStyle.value)

const initializeOptions = async () => {
  if (selectedTeam.value) {
    characterOptions.value = await fetchCharacterOptions(selectedTeam.value)
  }
  if (selectedCharacter.value) {
    styleOptions.value = await fetchStyleOptions(selectedCharacter.value, selectedTeam.value)
  }
  if (selectedStyle.value) {
    passiveSkillOptions.value = await fetchPassiveSkillOptions(
      selectedCharacter.value,
      selectedTeam.value,
      selectedStyle.value
    )
    charStore.setSelection(props.buttonKey, 'passiveSkill_value', passiveSkillOptions.value, props.selectedTab)
  }
}

onMounted(async () => {
  await initializeOptions()
})

watch(selectedTeam, async (newTeam) => {
  charStore.setSelection(props.buttonKey, 'team', newTeam, props.selectedTab)
  if (newTeam) {
    characterOptions.value = await fetchCharacterOptions(newTeam)
    selectedCharacter.value = null
    selectedStyle.value = null
  } else {
    characterOptions.value = []
    selectedCharacter.value = null
    selectedStyle.value = null
  }
})

watch(selectedCharacter, async (newChar) => {
  charStore.setSelection(props.buttonKey, 'character', newChar, props.selectedTab)
  if (newChar) {
    styleOptions.value = await fetchStyleOptions(newChar, selectedTeam.value)
    selectedStyle.value = null
  } else {
    styleOptions.value = []
    selectedStyle.value = null
  }
})

watch(
  selectedStyle,
  async (newStyle, oldStyle) => {
    // 初始化 skillStore.skills 中與舊 style 相關的項目
    if (sliderStore.rows > 0 && oldStyle) {
      console.log('skillStore.skills before reset:', skillStore.skills)
      skillStore.skills.forEach((row, rowIndex) => {
        row.forEach((button, buttonIndex) => {
          if (button.style === oldStyle) {
            skillStore.skills[rowIndex][buttonIndex] = {
              selectedTab: null,
              style: null,
              style_img: null,
              skill: null,
              target: null,
            }
          }
        })
      })
      console.log('skillStore.skills after reset:', skillStore.skills)
    }

    // 現有邏輯
    if (newStyle) {
      const selectedOption = styleOptions.value.find((option) => option.value === newStyle)
      if (selectedOption) {
        passiveSkillOptions.value = await fetchPassiveSkillOptions(
          selectedCharacter.value,
          selectedTeam.value,
          newStyle
        )
        const commandSkill = await fetchCommandSkill(selectedCharacter.value, selectedTeam.value, newStyle)
        charStore.setSelection(props.buttonKey, 'commandSkill', commandSkill, props.selectedTab)
        charStore.setSelection(props.buttonKey, 'style', newStyle, props.selectedTab)
        charStore.setSelection(props.buttonKey, 'img', selectedOption.icon, props.selectedTab)
        charStore.setSelection(props.buttonKey, 'passiveSkill', [], props.selectedTab)
        charStore.setSelection(props.buttonKey, 'passiveSkill_value', passiveSkillOptions.value, props.selectedTab)

        const findCharInfo = find(characterOptions.value, { value: selectedCharacter.value })
        charStore.setSelection(props.buttonKey, 'character_info', findCharInfo, props.selectedTab)

        selectedPassiveSkill.value = []
      }
    } else {
      charStore.setSelection(props.buttonKey, 'style', null, props.selectedTab)
      charStore.setSelection(props.buttonKey, 'img', null, props.selectedTab)
      charStore.setSelection(props.buttonKey, 'rank', null, props.selectedTab)
      charStore.setSelection(props.buttonKey, 'flower', null, props.selectedTab)
      charStore.setSelection(props.buttonKey, 'earring', null, props.selectedTab)
      charStore.setSelection(props.buttonKey, 'commandSkill', null, props.selectedTab)
      charStore.setSelection(props.buttonKey, 'passiveSkill', [], props.selectedTab)
      charStore.setSelection(props.buttonKey, 'passiveSkill_value', [], props.selectedTab)
      charStore.setSelection(props.buttonKey, 'skill', [], props.selectedTab)
      charStore.setSelection(props.buttonKey, 'character_info', {}, props.selectedTab)
      charStore.setSelection(props.buttonKey, 'spiritual', null, props.selectedTab)

      selectedRank.value = null
      selectedPassiveSkill.value = []
      selectedFlower.value = false
      selectedEarring.value = null
    }
  },
  { immediate: false }
)

const toggleCheckbox = () => {
  if (!isOtherDisable.value) {
    selectedFlower.value = !selectedFlower.value
    charStore.setSelection(props.buttonKey, 'flower', selectedFlower, props.selectedTab)
  }
}

const emit = defineEmits(['close'])
const closeContainer = async () => {
  if (selectedStyle.value) {
    charStore.setSelection(
      props.buttonKey,
      'skill',
      await fetchSkillOptions(selectedCharacter.value, selectedTeam.value, selectedStyle.value),
      props.selectedTab
    )
  }
  emit('close')
}
</script>

<template>
  <div @click="closeContainer" class="overlay">
    <div
      @click.stop
      class="container scrollbar-style-1"
      :style="{ overflow: isExpandedCollapse || isMobile() ? 'scroll' : 'visible' }"
    >
      <div class="button-group">
        <button @click="closeContainer" class="close">
          <img src="@/assets/custom-icon/close.svg" alt="Close" />
        </button>
      </div>
      <div class="section" style="padding: 0">
        <label>Team</label>
        <Multiselect
          v-model="selectedTeam"
          placeholder="Select team"
          label="name"
          :options="teamOptions"
        >
          <template v-slot:singlelabel="{ value }">
            <div class="multiselect-single-label">
              <img class="label-icon" :src="getAssetsFile(value.icon)" />
              <span :title="value.name">{{ value.name }}</span>
            </div>
          </template>
          <template v-slot:option="{ option }">
            <img class="option-icon" :src="getAssetsFile(option.icon)" />
            <span :title="option.name">{{ option.name }}</span>
          </template>
        </Multiselect>
      </div>
      <div class="section">
        <label>Character</label>
        <Multiselect
          v-model="selectedCharacter"
          placeholder="Select character"
          :disabled="isCharDisabled"
          :options="characterOptions"
          label="names"
          track-by="value"
        >
          <template v-slot:singlelabel="{ value }">
            <div class="multiselect-single-label">
              <img class="label-icon" :src="getAssetsFile(value.icon)" />
              <span :title="value.names[settingStore.lang]">{{ value.names[settingStore.lang] }}</span>
            </div>
          </template>
          <template v-slot:option="{ option }">
            <img class="option-icon" :src="getAssetsFile(option.icon)" />
            <span :title="option.names[settingStore.lang]">{{ option.names[settingStore.lang] }}</span>
          </template>
        </Multiselect>
      </div>
      <div class="section">
        <label>Style</label>
        <Multiselect
          v-model="selectedStyle"
          placeholder="Select style"
          :disabled="isStyleDisabled"
          :options="styleOptions"
          label="names"
          track-by="value"
        >
          <template v-slot:singlelabel="{ value }">
            <div class="multiselect-single-label">
              <img class="label-icon" :src="getAssetsFile(value.icon)" />
              <span :title="value.names[settingStore.lang]">{{ value.names[settingStore.lang] }}</span>
            </div>
          </template>
          <template v-slot:option="{ option }">
            <img class="option-icon" :src="getAssetsFile(option.icon)" />
            <span :title="option.names[settingStore.lang]">{{ option.names[settingStore.lang] }}</span>
          </template>
        </Multiselect>
      </div>
      <div class="section">
        <button
          class="collapse_btn"
          :class="{ collapse_btn_active: isExpandedCollapse }"
          @click="isExpandedCollapse = !isExpandedCollapse"
        >
          <svg
            class="collapse_arrow"
            :class="{ rotate: isExpandedCollapse }"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="m280-400 200-200 200 200H280Z" />
          </svg>
          <label style="font-size: 24px">Others</label>
        </button>
        <Collapse :when="isExpandedCollapse">
          <div class="section">
            <label>Rank</label>
            <Multiselect
              v-model="selectedRank"
              placeholder="Select Rank"
              :disabled="isOtherDisable"
              :options="rankOptions"
              @change="(value) => charStore.setSelection(props.buttonKey, 'rank', value, props.selectedTab)"
            />
            <div class="flower-container">
              <input
                type="checkbox"
                v-model="selectedFlower"
                :disabled="isOtherDisable"
                @change="charStore.setSelection(props.buttonKey, 'flower', selectedFlower, props.selectedTab)"
              />
              <img
                src="/src/assets/common/flower.webp"
                alt="Is Flower"
                :class="['flower-icon', { 'flower-icon-disabled': isOtherDisable }]"
                draggable="false"
                @click="toggleCheckbox"
              />
            </div>
          </div>
          <div class="section">
            <label>Earring</label>
            <Multiselect
              v-model="charStore.selections[props.selectedTab][props.buttonKey]['earring']"
              placeholder="Select earring"
              :disabled="isOtherDisable"
              :options="earringOptions"
              label="names"
              track-by="value"
            >
              <template v-slot:singlelabel="{ value }">
                <div class="multiselect-single-label">
                  <img class="label-icon" :src="getAssetsFile(value.icon)" />
                  <span :title="value.names[settingStore.lang]">{{ value.names[settingStore.lang] }}</span>
                </div>
              </template>
              <template v-slot:option="{ option }">
                <img class="option-icon" :src="getAssetsFile(option.icon)" />
                <span :title="option.names[settingStore.lang]">{{ option.names[settingStore.lang] }}</span>
              </template>
            </Multiselect>
          </div>
          <div class="section">
            <label>Passive Skill</label>
            <Multiselect
              v-model="charStore.selections[props.selectedTab][props.buttonKey]['passiveSkill']"
              mode="tags"
              placeholder="Select passive skill"
              :close-on-select="false"
              :disabled="isOtherDisable"
              :options="passiveSkillOptions"
              label="names"
              track-by="value"
              :locale="settingStore.lang"
              fallback-locale="zh-TW"
            />
          </div>
          <div class="section">
            <label>Spiritual Rupture</label>
            <Multiselect
              v-model="charStore.selections[props.selectedTab][props.buttonKey]['spiritual']"
              placeholder="Select Spiritual level"
              :disabled="isOtherDisable"
              :options="spiritualOptions"
              label="name"
              track-by="value"
            />
          </div>
        </Collapse>
      </div>
    </div>
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css" />
<style scoped>
.collapse_arrow {
  transition: transform 0.3s ease-in-out;
  transform: rotate(90deg);
  fill: #b4f9f9;
}
.rotate {
  transform: rotate(180deg);
}
.collapse_btn {
  display: flex;
  width: 100%;
  border: none;
  background-color: transparent;
  color: #74ebe3;
  font-size: 16px;
  align-items: center;
  justify-content: center;
}
.collapse_btn_active {
  border-bottom: 2px solid #a2fff9;
}
.close {
  background-color: transparent;
  padding: 1px;
  border: none;
  box-sizing: border-box;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close img {
  height: 100%;
  width: 100%;
}
.flower-container {
  display: flex;
  align-items: center;
  margin-top: 2px;
}
.flower-container > input,
.flower-container > img {
  cursor: pointer;
}
.flower-container > input:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}
.flower-icon {
  margin-left: 10px;
  width: 50px;
  height: 50px;
  pointer-events: auto;
}
.flower-icon-disabled {
  cursor: not-allowed !important;
  opacity: 0.8;
}
span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
.section {
  padding-top: 1.5rem;
}
.section .multiselect.is-disabled,
.section .multiselect.is-disabled * {
  opacity: 0.8;
  cursor: not-allowed !important;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1100;
  backdrop-filter: blur(5px);
}
.container {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(19, 18, 18);
  height: auto;
  max-height: 70%;
  width: 50%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  padding: 1rem !important;
  border: 3px solid #262426;
  box-sizing: border-box;
}
.container > .close {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
.container > .close > img {
  width: 24px;
  height: 24px;
}
.container > .close > img:hover {
  opacity: 0.8;
}
.container > .close > img:active {
  opacity: 0.6;
}
.container > .title {
  display: flex;
}
.button-group {
  display: flex;
  justify-content: flex-end;
  padding: 0 1rem 0 1rem;
}
.selectboxes {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  max-height: 81%;
}
.scrollbar-style-1::-webkit-scrollbar {
  display: none;
}
.scrollbar-style-1 {
  scrollbar-width: none; /* Firefox */
  padding: 0px;
}
label {
  font-family: 'Gugi', 'Noto Sans TC', sans-serif;
}
.option-icon,
.label-icon {
  width: 32px;
  height: 32px;
}
:deep(.multiselect-option),
.multiselect-single-label {
  display: flex;
  gap: 0.5rem;
}
.multiselect-single-label {
  width: 100%;
  justify-content: center;
}
:deep(.multiselect-tags-search) {
  background-color: black;
  color: white;
}
:deep(.multiselect) {
  background-color: black;
  border: 1px solid rgb(64, 68, 141);
  margin-top: 2px;
}
:deep(.multiselect.is-active) {
  box-shadow: none;
}
:deep(.multiselect-dropdown) {
  background-color: black;
  border: 1px solid rgb(64, 68, 141);
  max-height: 12rem;
}
:deep(.multiselect-dropdown::-webkit-scrollbar) {
  width: 5px;
}
:deep(.multiselect-dropdown::-webkit-scrollbar-track),
:deep(.multiselect-dropdown::-webkit-scrollbar-thumb) {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
:deep(.multiselect-dropdown::-webkit-scrollbar-thumb) {
  background-color: #555;
}
:deep(.multiselect-option.is-selected) {
  background-color: rgb(60, 57, 57);
}
:deep(.multiselect-option.is-pointed) {
  background-color: rgb(160, 160, 167);
  color: rgb(0, 0, 0);
}
:deep(.multiselect-caret) {
  margin-left: 14px;
}
:deep(.multiselect-clear) {
  padding: 0;
}
:deep(.multiselect-clear-icon:hover),
:deep(.multiselect-clear-icon:active),
:deep(.multiselect-clear-icon:focus) {
  background-color: #999;
}
:deep(.multiselect-clear-icon) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100%;
  font-size: 0;
}
:deep(.multiselect-tag) {
  background-color: #663fba;
}
@media (max-width: 800px) {
  .container {
    width: 90%;
  }
}
</style>