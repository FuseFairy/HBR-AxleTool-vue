<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import Multiselect from '@vueform/multiselect'
import { useCharStore } from '@/stores/char_stores'
import { useSliderStore } from '@/stores/slider_stores'
import { fetchCharacterOptions } from '@/api/charData'
import { fetchStyleOptions } from '@/api/styleData'
import { fetchSkillOptions } from '@/api/skillOptions'
import { fetchPassiveSkillOptions } from '@/api/passiveSkillOptions'
import { getAssetsFile } from '@/api/util'

const charStore = useCharStore()
const sliderStore = useSliderStore()

const props = defineProps({
  buttonKey: {
    type: Number,
    required: true
  }
})

const teamOptions = [
  { value: '30G', name: '30G', icon: 'team_icon/30G.webp' },
  { value: '31A', name: '31A', icon: 'team_icon/31A.webp' },
  { value: '31B', name: '31B', icon: 'team_icon/31B.webp' },
  { value: '31C', name: '31C', icon: 'team_icon/31C.webp' },
  { value: '31D', name: '31D', icon: 'team_icon/31D.webp' },
  { value: '31E', name: '31E', icon: 'team_icon/31E.webp' },
  { value: '31F', name: '31F', icon: 'team_icon/31F.webp' },
  { value: '31X', name: '31X', icon: 'team_icon/31X.webp' },
  { value: '31AB', name: 'Angel Beats!', icon: 'team_icon/Angel Beats.webp' }
]
const earringOptions = [
  { value: 'BREAK耳環', name: 'BREAK耳環', icon: 'earring_icon/break.webp' },
  { value: '進攻耳環', name: '進攻耳環', icon: 'earring_icon/attach.webp' },
  { value: 'DRIVE耳環', name: 'DRIVE耳環', icon: 'earring_icon/drive.webp' },
  { value: '爆破耳環', name: '爆破耳環', icon: 'earring_icon/explosion.webp' }
]
const rankOptions = Array.from({ length: 10 }, (_, i) => i + 1)
const characterOptions = ref([])
const styleOptions = ref([])
const passiveSkillOptions = ref([])
const skillOptions = ref([])

const selectedTeam = ref(charStore.getSelection(props.buttonKey, 'team'))
const selectedCharacter = ref(charStore.getSelection(props.buttonKey, 'character'))
const selectedStyle = ref(charStore.getSelection(props.buttonKey, 'style'))
const selectedEarring = ref(charStore.getSelection(props.buttonKey, 'earring'))
const selectedRank = ref(charStore.getSelection(props.buttonKey, 'rank'))
const selectedFlower = ref(charStore.getSelection(props.buttonKey, 'flower'))
const selectedPassiveSkill = ref(charStore.getSelection(props.buttonKey, 'passiveSkill'))
const selectedSkill = ref(charStore.getSelection(props.buttonKey, 'skill'))
if (selectedSkill.value.length > 0) {
  selectedSkill.value = selectedSkill.value.map((skill) => skill.name)
}

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
      selectedTeam.value
    )
    const fetchedSkills = await fetchSkillOptions(
      selectedCharacter.value,
      selectedTeam.value,
      selectedStyle.value
    )
    skillOptions.value = fetchedSkills.map((skill) => ({
      name: skill.name,
      sp: skill.sp,
      value: skill.name
    }))
  }
}

onMounted(async () => {
  await initializeOptions()
})

watch(selectedTeam, async (newTeam) => {
  charStore.setSelection(props.buttonKey, 'team', newTeam)
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
  charStore.setSelection(props.buttonKey, 'character', newChar)
  if (newChar) {
    styleOptions.value = await fetchStyleOptions(newChar, selectedTeam.value)
    selectedStyle.value = null
  } else {
    styleOptions.value = []
    selectedStyle.value = null
  }
})

watch(selectedStyle, async (newStyle) => {
  if (newStyle) {
    const selectedOption = styleOptions.value.find((option) => option.name === newStyle)
    if (selectedOption) {
      const fetchedSkills = await fetchSkillOptions(
        selectedCharacter.value,
        selectedTeam.value,
        newStyle
      )
      skillOptions.value = fetchedSkills.map((skill) => ({
        name: skill.name,
        sp: skill.sp,
        value: skill.name
      }))
      passiveSkillOptions.value = await fetchPassiveSkillOptions(
        selectedCharacter.value,
        selectedTeam.value
      )
      charStore.setSelection(props.buttonKey, 'style', newStyle)
      charStore.setSelection(props.buttonKey, 'img', selectedOption.icon)
      selectedSkill.value = []
    }
  } else {
    charStore.setSelection(props.buttonKey, 'style', null)
    charStore.setSelection(props.buttonKey, 'img', null)
    charStore.setSelection(props.buttonKey, 'skill', null)
    charStore.setSelection(props.buttonKey, 'rank', null)
    charStore.setSelection(props.buttonKey, 'flower', null)
    charStore.setSelection(props.buttonKey, 'earring', null)
    charStore.setSelection(props.buttonKey, 'passiveSkill', [])
    charStore.setSelection(props.buttonKey, 'skill', [])
    // 確保同步更新
    selectedRank.value = null
    selectedPassiveSkill.value = []
    selectedFlower.value = false
    selectedEarring.value = null
    selectedSkill.value = []
  }
})

const toggleCheckbox = () => {
  if (!isOtherDisable.value) {
    selectedFlower.value = !selectedFlower.value
    charStore.setSelection(props.buttonKey, 'flower', selectedFlower)
  }
}

const setSkill = (skills) => {
  selectedSkill.value = skills
  const temp = []
  skills.forEach((skillName) => {
    const skill = skillOptions.value.find((option) => option.value === skillName)
    if (skill) {
      temp.push({ name: skill.name, sp: skill.sp })
    }
  })

  charStore.setSelection(props.buttonKey, 'skill', temp)
}

const emit = defineEmits(['close'])
const closeContainer = async () => {
  if (selectedSkill.value.length <= 0 && selectedStyle.value) {
    charStore.setSelection(
      props.buttonKey,
      'skill',
      await fetchSkillOptions(selectedCharacter.value, selectedTeam.value, selectedStyle.value)
    )
  }
  emit('close')
}
</script>

<template>
  <div @click="closeContainer" class="overlay">
    <div @click.stop class="container">
      <div class="button-group">
        <button @click="closeContainer" class="close">
          <img src="@/assets/custom_icon/close.svg" alt="Close" />
        </button>
      </div>
      <div class="selectboxes scrollbar-style-1">
        <div class="section" style="padding: 0">
          <label>Team</label>
          <Multiselect
            v-model="selectedTeam"
            placeholder="Select team"
            label="name"
            :disabled="sliderStore.rows > 0"
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
            label="name"
            :disabled="isCharDisabled || sliderStore.rows > 0"
            :options="characterOptions"
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
          <label>Style</label>
          <Multiselect
            v-model="selectedStyle"
            placeholder="Select style"
            label="name"
            :disabled="isStyleDisabled || sliderStore.rows > 0"
            :options="styleOptions"
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
          <label>Rank (optional)</label>
          <Multiselect
            v-model="selectedRank"
            placeholder="Select Rank"
            :disabled="isOtherDisable"
            :options="rankOptions"
            @change="(value) => charStore.setSelection(props.buttonKey, 'rank', value)"
          />
          <div class="flower-container">
            <input
              type="checkbox"
              v-model="selectedFlower"
              :disabled="isOtherDisable"
              @change="charStore.setSelection(props.buttonKey, 'flower', selectedFlower)"
            />
            <img
              src="/src/assets/flower.webp"
              alt="Is Flower"
              :class="['flower-icon', { 'flower-icon-disabled': isOtherDisable }]"
              draggable="false"
              @click="toggleCheckbox"
            />
          </div>
        </div>

        <div class="section">
          <label>Earring (optional)</label>
          <Multiselect
            v-model="selectedEarring"
            placeholder="Select earring"
            label="name"
            :disabled="isOtherDisable"
            :options="earringOptions"
            @change="(value) => charStore.setSelection(props.buttonKey, 'earring', value)"
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
          <label>Skill (optional)</label>
          <Multiselect
            v-model="selectedSkill"
            mode="tags"
            placeholder="Select skill"
            label="name"
            :close-on-select="false"
            :disabled="isOtherDisable || sliderStore.rows > 0"
            :options="skillOptions"
            @change="(value) => setSkill(value)"
          />
        </div>

        <div class="section">
          <label>Passive Skill (optional)</label>
          <Multiselect
            v-model="selectedPassiveSkill"
            mode="tags"
            placeholder="Select passive skill"
            :close-on-select="false"
            :disabled="isOtherDisable"
            :options="passiveSkillOptions"
            @change="(value) => charStore.setSelection(props.buttonKey, 'passiveSkill', value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css" />
<style scoped>
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
  height: 70%;
  width: 31%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.button-group {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1rem 0 1rem;
}
.selectboxes {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  max-height: 81%;
}
.scrollbar-style-1::-webkit-scrollbar {
  width: 5px;
}
.scrollbar-style-1::-webkit-scrollbar-track,
.scrollbar-style-1::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.scrollbar-style-1::-webkit-scrollbar-thumb {
  background-color: #555;
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
