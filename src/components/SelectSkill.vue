<script setup>
import { ref, computed, nextTick } from 'vue'
import { useSliderStore } from '@/stores/slider_stores'
import { useSkillStore } from '@/stores/skill_stores'
import { useCharStore } from '@/stores/char_stores'
import Multiselect from '@vueform/multiselect'
import SelectAxleChar from './SelectAxleChar.vue'
import { getAssetsFile } from '@/api/util'

const sliderStore = useSliderStore()
const skillStore = useSkillStore()
const charStore = useCharStore()
const odOptions = ['OD1', 'OD2', 'OD3']


const options = Array.from({ length: 80 }, (_, i) => `T${i + 1}`);
const turnOptions = ['Switch', '追加回合', ...options]

const activeComponent = ref({ row: null, buttonKey: null })
const handleBoxClick = (row, key) => {
  activeComponent.value = { row, buttonKey: key }
}

const closeContainer = () => {
  activeComponent.value = { row: null, buttonKey: null }
}

const getFilteredSkills = (row, key) => {
  const currentSkill = skillStore.skills[row][key]
  if (currentSkill && currentSkill.style != null) {
    const currentStyle = currentSkill.style
    const selectedTab = currentSkill.selectedTab
    const selections = Object.values(charStore.selections[selectedTab])

    const currentSelection = selections.find((selection) => selection.style === currentStyle)
    const formattedSkills = currentSelection.skill.map((skill) => ({
      name: skill.name,
      value: skill.name,
      sp: skill.sp
    }))
    
    const commandSkill = currentSelection.commandSkill
    formattedSkills.unshift({ name: commandSkill, value: commandSkill, sp: 0 })

    const foundSkill = formattedSkills.some(
      (option) => option.name === skillStore.skills[row][key].skill
    )
    if (!foundSkill) {
      skillStore.skills[row][key].skill = null
    }

    return formattedSkills
  } else {
    skillStore.skills[row][key].skill = null

    return []
  }
}

const targetOptions = (row, key) => {
  const currentSkill = skillStore.skills[row][key]
  if (currentSkill && currentSkill.style != null) {
    const selectedTab = currentSkill.selectedTab
    return Object.values(charStore.selections[selectedTab])
      .filter((selection) => selection.character !== null && selection.style !== null)
      .map((selection) => selection.character)
  }
  else {
    return []
  }
}

const deleteRow = (index) => {
  sliderStore.rows -= 1
  skillStore.turns.splice(index, 1)
  skillStore.skills.splice(index, 1)
}

const copyRow = (index) => {
  sliderStore.rows += 1
  const copiedTurn = JSON.parse(JSON.stringify(skillStore.turns[index]));
  const copiedSkill = JSON.parse(JSON.stringify(skillStore.skills[index]));
  skillStore.turns.splice(index + 1, 0, copiedTurn);
  skillStore.skills.splice(index + 1, 0, copiedSkill);
}
</script>

<template>
  <div v-for="i in sliderStore.rows" :key="i" class="container">
    <button class="delete-button" @click="deleteRow(i - 1)">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#e8eaed"
      >
        <path
          d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"
        />
      </svg>
    </button>
    <button class="copy-button" @click="copyRow(i - 1)">
      <img src="@/assets/custom_icon/copy.svg" alt="copy"/>
    </button>
    <div class="column">
      <div class="empty"></div>
      <Multiselect
        v-model="skillStore.turns[i - 1].turn"
        placeholder="Select turn"
        :options="turnOptions"
      >
      </Multiselect>
      <Multiselect
        v-model="skillStore.turns[i - 1].od"
        placeholder="Select OD"
        :options="odOptions"
      >
      </Multiselect>
    </div>
    <div class="column" v-for="n in 3" :key="n">
      <button
        @click="handleBoxClick(i - 1, n - 1)"
        :class="{
          'circle-button selected-button': skillStore.skills[i - 1][n - 1].style_img !== null,
          'circle-button add-button': skillStore.skills[i - 1][n - 1].style_img === null
        }"
      >
        <img
          v-if="skillStore.skills[i - 1][n - 1].style_img !== null"
          class="char-img"
          :src="getAssetsFile(skillStore.skills[i - 1][n - 1].style_img)"
          :alt="skillStore.skills[i - 1][n - 1].style"
        />
        <img v-else class="icon-img" src="@/assets/custom_icon/add.svg" alt="Add" />
      </button>
      <Multiselect
        v-model="skillStore.skills[i - 1][n - 1].skill"
        placeholder="Select skill"
        label="name"
        searchable="true"
        :options="getFilteredSkills(i - 1, n - 1)"
      >
        <template v-slot:singlelabel="{ value }">
          <div class="multiselect-single-label">
            <span :title="value.name">{{ value.name }}/{{ value.sp }}SP</span>
          </div>
        </template>

        <template v-slot:option="{ option }">
          <span :title="option.name">{{ option.name }}/{{ option.sp }}SP</span>
        </template>
      </Multiselect>
      <Multiselect
        v-model="skillStore.skills[i - 1][n - 1].target"
        placeholder="Select target"
        :options="targetOptions(i - 1, n - 1)"
      >
      </Multiselect>
    </div>
  </div>
  <Transition name="modal">
    <SelectAxleChar
      v-if="activeComponent.row !== null"
      :row="activeComponent.row"
      :buttonKey="activeComponent.buttonKey"
      @close="closeContainer"
    />
  </Transition>
</template>

<style src="@vueform/multiselect/themes/default.css" />
<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from {
  transform: scale(0.8);
  opacity: 0;
}
.modal-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
.container {
  display: grid;
  position: relative;
  gap: 10px;
  padding: 20px;
  border-radius: 20px;
  background: rgba(68, 65, 65, 0.3);
  margin: 20px 20px 0 20px;
  grid-template-columns: 160px repeat(3, 1fr);
  align-items: center;
  transition: box-shadow 0.3s ease; /* 添加過渡效果 */
}
.container:hover {
  box-shadow: 0 0 0 0.5px #c12277, 0 0 20px rgba(240, 152, 199, 0.5);
}
.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.empty {
  width: 80px;
  height: 80px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
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
}
.selected-button {
  border: none;
  transition: transform 0.3s ease;
  box-shadow: 0 0 10px rgba(126, 156, 204, 0.8);
}
.selected-button:hover {
  box-shadow: 0 0 15px rgba(126, 156, 204, 0.8);
}
.selected-button:hover .char-img {
  transform: scale(1.1);
}
.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  cursor: pointer;
  border: none;
}
.delete-button:hover svg {
    fill: red;
}
.copy-button {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: transparent;
  cursor: pointer;
  border: none;
}
.copy-button:hover img {
    filter: hue-rotate(180deg) brightness(1.2);
  }
.fixed-button svg {
  width: 24px;
  height: 24px;
  fill: #ffffff;
  transition: fill 0.3s ease;
}
.fixed-button:hover svg {
  fill: #ea3323;
}
.char-img {
  transition: transform 0.3s ease;
  width: 100%;
  height: 100%;
}
.add-button {
  border: none;
  transition: background-color 0.3s ease;
}
.add-button:hover {
  background-color: rgba(204, 201, 201, 0.5);
}
.add-button:hover .icon-img {
  filter: invert(1);
}
.icon-img {
  width: 50px;
  height: 50px;
}
:deep(.multiselect-option) {
  display: flex;
  gap: 0.5rem;
}
:deep(.multiselect-search) {
  background-color: black;
  color: white;
}
:deep(.multiselect) {
  background-color: black;
  border: 1px solid rgb(64, 68, 141);
}
:deep(.multiselect.is-active) {
  box-shadow: none;
}
:deep(.multiselect-dropdown) {
  background-color: black;
  border: 1px solid rgb(64, 68, 141);
  max-height: 15rem;
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
@media (max-width: 800px) {
  .container {
    width: auto;
    grid-template-columns: repeat(4, 1fr);
  }
  .circle-button {
    width: 60px;
    height: 60px;
    font-size: 14px;
  }
  .empty {
    width: 60px;
    height: 60px;
  }
}
</style>
