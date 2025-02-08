<script setup>
import { ref } from 'vue'
import { useCharStore } from '@/stores/char_stores'
import { useSkillStore } from '@/stores/skill_stores'
import { useSliderStore } from '@/stores/slider_stores'
import { useShowRowStore } from '@/stores/showRow_stores.js'
import { useShowTeamStore } from '@/stores/showTeam_stores'
import { convertElementToJpg } from '@/scripts/domToImage'
import { getAssetsFile } from '@/scripts/util'
import { getUsedSkills } from '@/scripts/getUsedSkills'
import loading from 'vue-loading-overlay'
import ShowTableFilter from '@/components/ShowTableFilter.vue'
import { toast } from "vue3-toastify"
import "vue3-toastify/dist/index.css"

const isDownloading = ref(false)
const fullPage = ref(true)
const charStore = useCharStore()
const skillStore = useSkillStore()
const sliderStore = useSliderStore()
const showRowStore = useShowRowStore()
const showTeamStore = useShowTeamStore()
const earringDict = {
  'BREAK耳環':'earring_icon/break.webp',
  '進攻耳環':'earring_icon/attach.webp',
  'DRIVE耳環':'earring_icon/drive.webp',
  '爆破耳環':'earring_icon/explosion.webp'
}

const axleName = skillStore.axleName.trim()

const hasRank = (selectedTab) => {
  const rankInShowRow = showRowStore.showRow.includes('rank')
  const hasValidRankSelection = Object.values(charStore.selections[selectedTab]).some(
    (selection) => selection?.rank !== null || selection?.flower
  )

  return rankInShowRow && hasValidRankSelection
}

const hasEarring = (selectedTab) => {
  const earringInShowRow = showRowStore.showRow.includes('earring')
  const hasValidEarringSelection = Object.values(charStore.selections[selectedTab]).some(
    (selection) => selection?.earring !== null
  )

  return earringInShowRow && hasValidEarringSelection
}

const hasPassiveSkill = (selectedTab) => {
  const passiveSkillInShowRow = showRowStore.showRow.includes('passive skill')
  const hasValidPassiveSkillSelection = Object.values(charStore.selections[selectedTab]).some(
    (selection) => selection?.passiveSkill !== null && selection?.passiveSkill.length > 0
  )

  return passiveSkillInShowRow && hasValidPassiveSkillSelection
}

const downloadTable = async () => {
  isDownloading.value = true
  try {
    await convertElementToJpg('show-axle')
  } catch (error) {
    console.error('Error during download:', error)
    toast("下載發生錯誤，請盡量使用Chrome、Edge瀏覽器進行下載", {
      "theme": "colored",
      "type": "error",
      "position": "top-right",
      "autoClose": 3000,
      "dangerouslyHTMLString": true,
      "newestOnTop": true,
      "limit": 1,
      "toastStyle": {
        "font-family": "LXGW WenKai Mono TC",
      },
    })
  } finally {
    isDownloading.value = false
  }
}

function hasTeam(selectedTab) {
  const usedSkills = getUsedSkills(selectedTab)
  return (
    Object.keys(usedSkills).length > 0 && Object.values(usedSkills).some((set) => set.size !== 0)
  )
}

const emit = defineEmits(['close'])
const closeTable = () => {
  emit('close')
}
</script>

<template>
  <div @click="closeTable" class="overlay">
    <loading
      v-model:active="isDownloading"
      :can-cancel="false"
      :is-full-page="fullPage"
      :lock-scroll="true"
      background-color="#54504b"
      color="#79d1cb"
    />
    <div @click.stop class="container">
      <div class="button-group">
        <div class="left-button-group" >
          <ShowTableFilter />
          <button @click="downloadTable" class="download">
            <img src="@/assets/custom_icon/download.svg" alt="Download" />
          </button>
        </div>
        <p class="mobile-warning">如覺得畫面太擠，可橫置裝置獲得更好的體驗!</p>
        <button @click="closeTable" class="close">
          <img src="@/assets/custom_icon/close.svg" alt="Close" />
        </button>
      </div>
      <div class="table scrollbar-style-1">
        <div v-if="sliderStore.rows <= 0" class="sleeping-image">
          <img src="/src/assets/sleeping.webp" />
        </div>
        <div v-else id="show-axle" class="table-wrapper">
          <span v-if="axleName.length > 0" class="axle-name">{{ axleName }}</span>
          <div v-for="(selectedTab, index) in showTeamStore.showTeam" :key="selectedTab">
            <div
              v-if="showTeamStore.showTeam.length > 1 && index > 0"
              class="axle-line-container"
              style="margin-top: 20px"
            >
              <div class="blue-line"></div>
            </div>
            <div class="table-container">
              <div v-for="i in 7" class="table-column">
                <div class="character-container">
                  <div v-if="i === 1"></div>
                  <div v-else>
                    <img
                      v-if="charStore.selections[selectedTab][i - 1].img"
                      :src="getAssetsFile(charStore.selections[selectedTab][i - 1].img)"
                      :alt="charStore.selections[selectedTab][i - 1].style"
                      class="character-image"
                    />

                    <!-- Rank -->
                    <div
                      v-if="hasRank(selectedTab) && charStore.selections[selectedTab][i - 1].rank !== null"
                      class="rank-text"
                    >
                      {{ charStore.selections[selectedTab][i - 1].rank }}
                    </div>
                    <div
                      v-else-if="
                        hasRank(selectedTab) &&
                        charStore.selections[selectedTab][i - 1].rank === null &&
                        charStore.selections[selectedTab][i - 1].style !== null
                      "
                      class="rank-text"
                    >
                      <span>0</span>
                    </div>
                    <img
                      v-if="hasRank(selectedTab) && charStore.selections[selectedTab][i - 1].flower"
                      src="/src/assets/flower.webp"
                      alt="flower"
                      class="flower-img"
                    />

                    <!-- Earring -->
                    <img
                      v-if="hasEarring(selectedTab) && charStore.selections[selectedTab][i - 1].earring !== null"
                      :src="getAssetsFile(earringDict[charStore.selections[selectedTab][i - 1].earring])"
                      :alt="charStore.selections[selectedTab][i - 1].earring"
                      class="earring-icon"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="hasPassiveSkill(selectedTab)"
              class="table-container"
              style="margin-top: 20px"
            >
              <div v-for="i in 7" class="table-column">
                <div v-if="i === 1" class="label">Passive<br />Skill</div>
                <div
                  v-else-if="
                    charStore.selections[selectedTab][i - 1].passiveSkill !== null &&
                    charStore.selections[selectedTab][i - 1].passiveSkill.length > 0
                  "
                  class="text"
                >
                  <span
                    v-for="skill in charStore.selections[selectedTab][i - 1].passiveSkill"
                    class="passive-skill"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
            <!-- Used skill row -->
            <div
              v-if="showRowStore.showRow.includes('skill') && hasTeam(selectedTab)"
              class="Used-skill table-container"
              style="margin-top: 20px"
            >
              <div v-for="i in 7" class="table-column">
                <div v-if="i === 1" class="label">Skill</div>
                <div
                  v-else-if="charStore.selections[selectedTab][i - 1].style !== null"
                  class="text"
                >
                  <span
                    v-for="skill in Array.from(
                      getUsedSkills(selectedTab)[charStore.selections[selectedTab][i - 1].style]
                    )"
                    class="used-skill"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- Axle -->
          <div v-if="showRowStore.showRow.includes('axle')">
            <div
              v-if="sliderStore.rows > 0 && showTeamStore.showTeam.length > 0"
              class="axle-line-container"
              style="margin-top: 20px"
            >
              <div class="red-line"></div>
            </div>
            <div
              v-if="sliderStore.rows > 0"
              v-for="row in sliderStore.rows"
              :class="
                skillStore.turns[row - 1].turn !== 'Switch'
                  ? 'table-container-2'
                  : 'table-container-3'
              "
              :style="{
                'background-color': skillStore.turns[row - 1].turn === 'Switch'
                  ? 'rgba(26, 26, 26, 0.9)'
                  : (row % 2 === 0 ? 'rgba(33, 33, 33, 0.9)' : 'transparent')
              }"
            >
              <div
                v-if="skillStore.turns[row - 1].turn !== 'Switch'"
                v-for="col in 4"
                class="axle-table-column"
              >
                <div v-if="col === 1" class="label">
                  <span
                    v-if="
                      skillStore.turns[row - 1].turn !== null &&
                      skillStore.turns[row - 1].od !== null
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
                <span class="switch-turn">{{ skillStore.turns[row - 1].turn }}</span>
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
.sleeping-image {
  display: block;
  margin: auto;
}
.switch-turn {
  font-size: 36px;
  font-style: italic;
  font-weight: bold;
  color: rgb(255, 215, 0);
  font-family: 'Kose', 'Noto Sans TC', sans-serif;
}
.character-container {
  position: relative;
  display: inline-block;
}
.axle-name {
  display: block;
  font-size: 36px;
  text-align: center;
  margin: 0 auto 20px;
  padding: 0 24px;
  font-family: 'Kose', 'Noto Sans TC', sans-serif;
  color: rgb(225, 230, 209);
  border-bottom: 4px solid rgb(110, 107, 102);
}
.option-icon {
  width: 34px;
  height: 34px;
  padding-right: 7px;
}
.option-container {
  display: flex;
  flex-direction: column;
}
.option-images {
  display: flex;
  flex-wrap: wrap;
  padding-top: 1px;
}
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
  padding: 0.5rem 0;
}
.table-container {
  display: grid;
  grid-template-columns: 100px repeat(6, 1fr);
  margin: 0 10px;
  width: inherit;
}
.Used-skill {
  background: rgba(113, 108, 122, 0.3);
  border-radius: 10px;
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
  background-color: transparent;
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
  text-align: center;
  justify-content: center;
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
  border-top: 4px solid #d64040;
}
.blue-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 3px solid #4c71c9;
  margin-bottom: 15px;
}
.label {
  font-size: 18px;
  font-family: 'Gugi', 'Noto Sans TC', sans-serif;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ddb0b0;
  height: 100%;
}
.character-image {
  display: block;
  width: 80px;
  height: 80px;
  object-fit: contain;
}
.text {
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.rank-text {
  position: absolute;
  top: -1px;
  right: -6px;
  background-color: rgba(93, 80, 86, 0.7);
  font-family: 'Kose', 'Noto Sans TC', sans-serif;
  color: rgb(192, 229, 250);
  width: 25px;
  height: 25px;
  padding: 0;
  border-radius: 50%;
  font-size: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 8px 4px rgba(201, 198, 200, 0.8);
  text-shadow: 0 0 4px rgb(0, 0, 0), 0 0 8px rgb(0, 0, 0), 0 0 16px rgb(0, 0, 0);
}
.used-skill {
  margin: 3px;
  padding: 2px 8px;
  background-color: #312828;
  border-radius: 4px;
  word-wrap: break-word;
  word-break: break-word;
  display: inline-block;
  border: 2px solid rgb(86, 64, 64);
}
.passive-skill {
  margin: 3px;
  padding: 2px 8px;
  background-color: #2d3851;
  border-radius: 4px;
  word-wrap: break-word;
  word-break: break-word;
  display: inline-block;
}
.axle-text {
  font-size: 18px;
  font-weight: normal;
  height: 100%;
  vertical-align: middle;
}
.flower-img {
  position: absolute;
  bottom: -10px;
  right: 5px;
  height: 30px;
  width: 30px;
  filter: drop-shadow(0 0 12px rgb(255, 190, 218));
}
.earring-icon {
  position: absolute;
  bottom: 0px;
  left: -10px;
  height: 33px;
  width: 33px;
  filter: drop-shadow(0 0 12px rgb(190, 240, 255));
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
.left-button-group {
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 15px;
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
  font-size: 18px;
}
@media (max-width: 950px) {
  .container {
    width: 100%;
    height: 100%;
    max-width: none;
  }
  .mobile-warning {
    display: block;
  }
}
</style>
