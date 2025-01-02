<script setup>
import { ref, computed } from 'vue'
import { useCharStore } from '@/stores/char_stores'
import { useSkillStore } from '@/stores/skill_stores'
import { useLastTabStore } from '@/stores/lastTab_stores'
import { getAssetsFile } from '@/api/util'

const charStore = useCharStore()
const skillStore = useSkillStore()
const lastTabStore = useLastTabStore()

const props = defineProps({
  row: {
    type: Number,
    required: true
  },
  buttonKey: {
    type: Number,
    required: true
  }
})

const tabs = [
  { key: 1, label: 'Team 1' },
  { key: 2, label: 'Team 2' },
  { key: 3, label: 'Team 3' },
  { key: 4, label: 'Team 4' },
  { key: 5, label: 'Team 5' },
  { key: 6, label: 'Team 6' }
]

const selectedTab = ref(
  skillStore.skills[props.row][props.buttonKey]?.selectedTab ??
    (lastTabStore.axle_lastTab !== 1 ? lastTabStore.axle_lastTab : 1)
)

const selectTab = (key) => {
  selectedTab.value = key
  lastTabStore.axle_lastTab = key
}

const filteredSelections = computed(() => {
  const filtered = Object.fromEntries(
    Object.entries(charStore.selections[selectedTab.value]).filter(
      ([key, value]) => value.img !== null
    )
  )
  return filtered
})

const isSelected = (key) => {
  const skill = skillStore.skills[props.row][props.buttonKey]
  const selection = filteredSelections.value[key]
  return skill.style === selection.style && skill.selectedTab === selectedTab.value
}

const handleImageClick = (key) => {
  if (isSelected(key)) {
    skillStore.skills[props.row][props.buttonKey].selectedTab = null
    skillStore.skills[props.row][props.buttonKey].style = null
    skillStore.skills[props.row][props.buttonKey].style_img = null
  } else {
    skillStore.skills[props.row][props.buttonKey].selectedTab = selectedTab.value
    skillStore.skills[props.row][props.buttonKey].style = filteredSelections.value[key].style
    skillStore.skills[props.row][props.buttonKey].style_img = filteredSelections.value[key].img
    closeContainer()
  }
}

const emit = defineEmits(['close'])
const closeContainer = () => {
  emit('close')
}
</script>

<template>
  <div @click="closeContainer" class="overlay">
    <div @click.stop class="container">
      <button @click="closeContainer" class="close">
        <img src="@/assets/custom_icon/close.svg" alt="Close" />
      </button>
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab"
          :class="{ active: selectedTab === tab.key }"
          @click="selectTab(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="button-container">
        <button
          v-for="(item, key) in filteredSelections"
          :key="key"
          class="circle-button selected-button"
          @click="handleImageClick(key)"
        >
          <img class="char-img" :src="getAssetsFile(item.img)" :alt="item.style" />
          <div v-if="isSelected(key)" class="overlay-text">Selected</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #ccc;
}

button.tab {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: white;
  transition: background-color 0.3s ease;
  flex-grow: 1;
  font-family: 'Gugi', 'Noto Sans TC', sans-serif;
}

button.tab.active {
  background-color: grey;
  color: black;
}

button.tab:hover {
  background-color: #454242;
}

.container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(19, 18, 18);
  height: auto;
  width: auto;
  box-sizing: border-box;
  padding: 1.5rem;
  padding-right: 3rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close {
  background-color: transparent;
  padding: 1px;
  border: none;
  box-sizing: border-box;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.close img {
  height: 100%;
  width: 100%;
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

.button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.circle-button {
  border-radius: 50%;
  width: 80px;
  height: 80px;
  aspect-ratio: 1 / 1;
  font-size: 16px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(79, 74, 74, 0.5);
  position: relative;
}

.selected-button {
  border: none;
  transition: transform 0.3s ease;
  box-shadow: 0 0 10px rgba(188, 115, 194, 0.8);
}

.selected-button:hover {
  box-shadow: 0 0 15px rgba(188, 115, 194, 0.8);
}

.selected-button:hover .char-img {
  transform: scale(1.1);
}

.char-img {
  transition: transform 0.3s ease;
  width: 100%;
  height: 100%;
}

/* .selected {
  border: 2px solid #ffffff;
} */

.overlay-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  pointer-events: none;
}
</style>
