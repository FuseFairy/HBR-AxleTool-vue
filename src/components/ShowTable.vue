<script setup>
import { ref, computed } from 'vue'
import { useCharStore } from '@/stores/char_stores'
import { useSkillStore } from '@/stores/skill_stores'
import { useSliderStore } from '@/stores/slider_stores'
import { useShowRowStore } from '@/stores/showRow_stores.js'
import { useShowTeamStore } from '@/stores/showTeam_stores'
import { convertElementToPng } from '@/api/domToImage'
import { getAssetsFile } from '@/api/util'
import { getUsedSkills } from '@/api/getUsedSkills'
import loading from 'vue-loading-overlay'
import Multiselect from '@vueform/multiselect'

const isLoading = ref(false)
const fullPage = ref(true)
const charStore = useCharStore()
const skillStore = useSkillStore()
const sliderStore = useSliderStore()
const showRowStore = useShowRowStore()
const showTeamStore = useShowTeamStore()

const showOptions = [
  { value: 'rank', name: 'Rank'},
  { value: 'earring', name: 'Earring'},
  { value: 'passive skill', name: 'Passive Skill'},
  { value: 'skill', name: 'Skill'},
  { value: 'axle', name: 'Axle'}
]
const showTeams = [
  { value: 1, name: 'Team 1' },
  { value: 2, name: 'Team 2' },
  { value: 3, name: 'Team 3' },
  { value: 4, name: 'Team 4' },
  { value: 5, name: 'Team 5' },
  { value: 6, name: 'Team 6' }
]

const hasRank = (selectedTab) => {
  const rankInShowRow = showRowStore.showRow.includes('rank');
  const hasValidRankSelection = Object.values(charStore.selections[selectedTab]).some(
    (selection) => selection?.rank !== null || selection?.flower
  );

  return rankInShowRow && hasValidRankSelection;
};

const hasEarring = (selectedTab) => {
  const earringInShowRow = showRowStore.showRow.includes('earring');
  const hasValidEarringSelection = Object.values(charStore.selections[selectedTab]).some((selection) => selection?.earring !== null);

  return earringInShowRow && hasValidEarringSelection;
};

const hasPassiveSkill = (selectedTab) => {
  const passiveSkillInShowRow = showRowStore.showRow.includes('passive skill');
  const hasValidPassiveSkillSelection = Object.values(charStore.selections[selectedTab]).some(
    (selection) => selection?.passiveSkill !== null && selection?.passiveSkill.length > 0
  );

  return passiveSkillInShowRow && hasValidPassiveSkillSelection;
};

const downloadTable = async () => {
  isLoading.value = true
  try {
    await convertElementToPng('show-axle')
  } catch (error) {
    console.error('Error during download:', error)
    alert('Error during download:', error)
  } finally {
    isLoading.value = false
  }
}

const emit = defineEmits(['close'])
const closeTable = () => {
  emit('close')
}
</script>

<template>
  <div @click="closeTable" class="overlay">
    <loading
      v-model:active="isLoading"
      :can-cancel="false"
      :is-full-page="fullPage"
      :lock-scroll="true"
      background-color="#54504b"
      color="#79d1cb"
    />
    <div @click.stop class="container">
      <div class="button-group">
        <span style="display: flex; align-items: center">
          <button @click="downloadTable" class="download">
            <img src="@/assets/custom_icon/download.svg" alt="Download" />
          </button>
          <Multiselect
            v-model="showTeamStore.showTeam"
            mode="tags"
            placeholder="Display Team"
            label="name"
            :close-on-select="false"
            :options="showTeams"
            @change="(value) => showTeamStore.setShowTeam(value)"
            style="margin-left: 5px;"
          />
          <Multiselect
            v-model="showRowStore.showRow"
            mode="tags"
            placeholder="Display Row"
            label="name"
            :close-on-select="false"
            :options="showOptions"
            @change="(value) => showRowStore.setShowRow(value)"
            style="margin-left: 5px;"
          />
          <p class="mobile-warning">如覺得畫面太擠，可橫置裝置獲得更好的體驗!</p>
        </span>
        <button @click="closeTable" class="close">
          <img src="@/assets/custom_icon/close.svg" alt="Close" />
        </button>
      </div>
      <div id="show-axle" class="table scrollbar-style-1">
        <div class="table-wrapper">
          <div v-for="(selectedTab, index) in showTeamStore.showTeam" :key="selectedTab">
            <div v-if="showTeamStore.showTeam.length > 1 && index > 0" class="axle-line-container" style="margin-top: 20px">
              <div class="blue-line"></div>
            </div>
            <h1 v-if="showTeamStore.showTeam.length > 1" class="teamTitle" :style="{ 'margin-top': selectedTab === 1 ? '0' : '10px' }">
              Team {{selectedTab}}
            </h1>
            <!-- Image row -->
            <div class="table-container">
              <div v-for="i in 7" class="table-column">
                <div v-if="i === 1"></div>
                <img
                  v-else-if="charStore.selections[selectedTab][i - 1].img"
                  :src="getAssetsFile(charStore.selections[selectedTab][i - 1].img)"
                  :alt="charStore.selections[selectedTab][i - 1].style"
                  class="character-image"
                />
              </div>
            </div>
            <!-- Rank row -->
            <div v-if="hasRank(selectedTab)" class="table-container" style="margin-top: 20px">
              <div v-for="i in 7" class="table-column">
                <div v-if="i === 1" class="label">Rank</div>
                <div v-else-if="charStore.selections[selectedTab][i - 1].rank !== null" class="text">
                  {{ charStore.selections[selectedTab][i - 1].rank }}
                  <img
                    v-if="charStore.selections[selectedTab][i - 1].flower"
                    src="/src/assets/flower.webp"
                    alt="flower"
                    class="flower-img"
                  />
                </div>
                <div
                  v-else-if="
                    charStore.selections[selectedTab][i - 1].rank === null &&
                    charStore.selections[selectedTab][i - 1].style !== null
                  "
                  class="text"
                >
                  <span>0</span>
                  <img
                    v-if="charStore.selections[selectedTab][i - 1].flower"
                    src="/src/assets/flower.webp"
                    alt="flower"
                    class="flower-img"
                  />
                </div>
              </div>
            </div>
            <!-- Earring row -->
            <div v-if="hasEarring(selectedTab)" class="table-container" style="margin-top: 20px">
              <div v-for="i in 7" class="table-column">
                <div v-if="i === 1" class="label">Earring</div>
                <div v-else-if="charStore.selections[selectedTab][i - 1].earring !== null" class="text">
                  {{ charStore.selections[selectedTab][i - 1].earring }}
                </div>
              </div>
            </div>
            <!-- Passive Skill row -->
            <div v-if="hasPassiveSkill(selectedTab)" class="table-container" style="margin-top: 20px">
              <div v-for="i in 7" class="table-column">
                <div v-if="i === 1" class="label">Passive<br />Skill</div>
                <div
                  v-else-if="
                    charStore.selections[selectedTab][i - 1].passiveSkill !== null &&
                    charStore.selections[selectedTab][i - 1].passiveSkill.length > 0
                  "
                  class="text"
                  style="white-space: pre-line;"
                >
                  {{ charStore.selections[selectedTab][i - 1].passiveSkill.join('/ ') }}
                </div>
              </div>
            </div>
            <!-- Used skill row -->
            <div v-if="showRowStore.showRow.includes('skill') && Object.values(getUsedSkills(selectedTab)).every(set => set.size !== 0)" class="table-container" style="margin-top: 20px">
              <div v-for="i in 7" class="table-column">
                <div v-if="i === 1" class="label">Skill</div>
                <div
                  v-else-if="
                    charStore.selections[selectedTab][i - 1].style !== null
                  "
                  class="text"
                >
                  {{ Array.from(getUsedSkills(selectedTab)[charStore.selections[selectedTab][i - 1].style]).join('\n') }}
                </div>
              </div>
            </div>
          </div>
          <!-- Axle -->
          <div v-if="showRowStore.showRow.includes('axle')">
            <div v-if="sliderStore.rows > 0 && showTeamStore.showTeam.length > 0" class="axle-line-container" style="margin-top: 20px">
              <div class="red-line"></div>
            </div>
            <div
              v-if="sliderStore.rows > 0"
              v-for="row in sliderStore.rows"
              :class="skillStore.turns[row - 1].turn !== 'Switch' ? 'table-container-2' : 'table-container-3'"
              :style="{ 'border-top': row > 1 ? '2px dashed gray' : 'none' }"
            >
              <div v-if="skillStore.turns[row - 1].turn !== 'Switch'" v-for="col in 4" class="axle-table-column">
                <div v-if="col === 1" class="label">
                  <span
                    v-if="
                      skillStore.turns[row - 1].turn !== null && skillStore.turns[row - 1].od !== null
                    "
                  >
                    {{ skillStore.turns[row - 1].turn }} / {{ skillStore.turns[row - 1].od }}
                  </span>
                  <span v-else-if="skillStore.turns[row - 1].turn !== null">{{
                    skillStore.turns[row - 1].turn
                  }}</span>
                </div>
                <div v-else>
                  <span v-if="skillStore.skills[row - 1][col - 2].skill !== null" class="axle-item">
                    <div class="image">
                      <img
                        :src="getAssetsFile(skillStore.skills[row - 1][col - 2].style_img)"
                        :alt="skillStore.skills[row - 1][col - 2].style"
                        class="axle-img"
                      />
                    </div>
                    <div class="txt">
                      <span class="axle-text">{{ skillStore.skills[row - 1][col - 2].skill }}</span>
                      <span
                        v-if="skillStore.skills[row - 1][col - 2].target !== null"
                        class="axle-text"
                        ><br />（{{ skillStore.skills[row - 1][col - 2].target }}）</span
                      >
                    </div>
                  </span>
                </div>
              </div>
              <div v-else>
                <span>{{ skillStore.turns[row - 1].turn }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css" />
<style scoped>
.teamTitle {
  text-align: center;
  font-size: 18px;
  margin-bottom: 6px;
}
.axle-item {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: 'img txt';
  align-items: center;
  padding: 0 20px;
}
image {
  grid-area: img;
}
.txt {
  grid-area: txt;
  text-align: center;
}
.table-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.table-container {
  display: grid;
  grid-template-columns: 100px repeat(6, 1fr);
  margin: 0 10px;
  width: inherit;
}
.table-container-2 {
  display: grid;
  grid-template-columns: 100px repeat(3, 1fr);
  margin: 0 10px;
  padding: 10px 0;
  width: inherit;
}
.table-container-3 {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  padding: 10px 0;
  width: inherit;
  background-color: #2a2f34;
}
.axle-line-container {
  display: grid;
  grid-template-columns: 1fr;
  margin: 0 10px;
  width: inherit;
}
.table-column {
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.axle-table-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.axle-img {
  margin-right: 5px;
  height: 40px;
  width: 40px;
  vertical-align: middle;
}
.red-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 2px solid #d64040;
}
.blue-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 2px solid #4c71c9;
}
.label {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.character-image {
  width: 70px;
  height: 70px;
  object-fit: contain;
}
.text {
  display: flex;
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100%;
  white-space: pre-line;
}
.axle-text {
  font-size: 18px;
  font-weight: normal;
  height: 100%;
  vertical-align: middle;
}
.flower-img {
  margin-left: 5px;
  height: 20px;
  width: 20px;
}
.close {
  background-color: transparent;
  padding: 1px;
  border: none;
  box-sizing: border-box;
  height: 32px;
  width: 32px;
  cursor: pointer;
}
.download {
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
.download:hover {
  background-color: rgba(78, 69, 69, 0.3);
}
.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(19, 18, 18);
  height: auto;
  max-height: 90%;
  width: 70%;
  max-width: 1024px;
  box-sizing: border-box;
  padding: 1rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
}
.table {
  display: flex;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 0.5rem;
}
.scrollbar-style-1 {
  overflow-x: auto;
}
.scrollbar-style-1::-webkit-scrollbar {
  width: 5px;
  height: 0;
}
.scrollbar-style-1::-webkit-scrollbar-track,
.scrollbar-style-1::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.scrollbar-style-1::-webkit-scrollbar-thumb {
  background-color: #555;
}
.mobile-warning {
  display: none;
  color: rgb(162, 87, 87);
  margin-left: 10px;
}
:deep(.multiselect-option),
.multiselect-single-label {
  display: flex;
  gap: 0.5rem;
}
:deep(.multiselect) {
  background-color: rgba(50, 48, 50, 0.8);
  border: 2px solid rgba(50, 48, 50, 0.8);
  margin-top: 2px;
  border-radius: 20px;
}
:deep(.multiselect.is-active) {
  box-shadow: none;
}
:deep(.multiselect-dropdown) {
  background-color: rgba(50, 48, 50, 0.8);
  border: 2px solid rgba(50, 48, 50, 0.8);
  max-height: 15rem;
  border-radius: 20px;
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
  background-color: rgb(38, 37, 37);
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
  background-color: rgb(89, 85, 89);
  border-radius: 20px;
}
:deep(.multiselect-wrapper) {
  min-width: 250px;
  max-width: 300px;
}
@media (max-width: 950px) {
  .container {
    width: 100%;
    max-width: none;
  }
  .mobile-warning {
    display: block;
  }
  :deep(.multiselect-wrapper) {
  min-width: auto;
}
}
</style>
