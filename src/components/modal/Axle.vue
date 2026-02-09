<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useCharStore } from '@/store/char'
  import { useSkillStore } from '@/store/axle'
  import { useUiStore } from '@/store/ui'
  import { useSettingStore } from '@/store/setting'
  import { getAssetsFile } from '@/utils/assets/getAssetsFile'
  import { getUsedSkills } from '@/utils/state-getters/getUsedSkills'
  import ShowTableFilter from '@/components/ui/ShowTableFilter.vue'
  import shareButton from '@/components/ui/ShareButton.vue'
  import DownloadButton from '@/components/ui/DownloadButton.vue'
  import 'vue3-toastify/dist/index.css'
  import { find } from 'lodash-es'
  import LoadingOverlay from '@/components/modal/LoadingOverlay.vue'
  import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
  import { scrollbarOptions } from '@/config/scrollbarConfig.js'

  const isVisible = ref(false)
  onMounted(() => {
    isVisible.value = true
  })

  const isLoading = ref(false)
  const charStore = useCharStore()
  const skillStore = useSkillStore()
  const uiStore = useUiStore()
  const settingStore = useSettingStore()
  const earringDict = {
    BREAK耳環: 'earring-icon/break.webp',
    進攻耳環: 'earring-icon/attach.webp',
    DRIVE耳環: 'earring-icon/drive.webp',
    爆破耳環: 'earring-icon/explosion.webp',
  }
  const additionalTurn = { 'zh-TW': '追加回合', 'jp': '追加ターン', 'zh-CN': '追加回合', 'zh-CN-CN': '追加回合' }
  const axleName = skillStore.axleName.trim()

  const hasRank = () => {
    const rankInShowRow = uiStore.showTag.includes('rank')
    return rankInShowRow
  }

  const hasEarring = () => {
    const earringInShowRow = uiStore.showTag.includes('earring')
    return earringInShowRow
  }

  const hasSpiritual = () => {
    const spiritualInShowRow = uiStore.showTag.includes('spiritual')
    return spiritualInShowRow
  }

  const hasPassiveSkill = (selectedTab) => {
    const passiveSkillInShowRow = uiStore.showTag.includes('passive skill')
    const hasValidPassiveSkillSelection = Object.values(charStore.selections[selectedTab]).some(
      (selection) => selection?.passiveSkill !== null && selection?.passiveSkill.length > 0,
    )
    return passiveSkillInShowRow && hasValidPassiveSkillSelection
  }

  function hasTeam(selectedTab) {
    const usedTeams = uiStore.showTeam
    return usedTeams.includes(selectedTab)
  }

  const getBackgroundColor = (row) => {
    const turnData = skillStore.turns[row - 1]
    if (!turnData) return 'transparent'
    if (turnData.turn === 'Switch') return 'rgba(26, 26, 26, 0.9)'
    const odColors = {
      OD1: 'rgba(229, 131, 207, 0.25)',
      OD2: 'rgba(189, 247, 211, 0.25)',
      OD3: 'rgba(237, 225, 108, 0.25)',
    }
    if (turnData.od) {
      const odPrefix = turnData.od.slice(0, 3)
      if (odPrefix in odColors) return odColors[odPrefix]
    }
    return row % 2 === 0 ? 'rgba(33, 33, 33, 0.9)' : 'transparent'
  }

  const displayUsedSkillName = (tab, skillObj, style) => {
    let skillName = ''
    const skillValue = skillObj.value
    const count = skillObj.count
    const charInfo = charStore.selections[tab]
    const styleInfo = find(charInfo, (characterData) => {
      return characterData.style === style
    })
    const skills = styleInfo['skill']
    const foundSkillObject = find(skills, (s) => s.value === skillValue)
    if (foundSkillObject) {
      skillName = foundSkillObject.names[settingStore.lang]
      if (count > 1) {
        skillName += ` [${count}]`
      }
    } else {
      skillName = ''
    }
    return skillName
  }

  const displayPassiveSkillName = (tab, skillValue, style) => {
    let skillName = ''
    const charInfo = charStore.selections[tab]
    const styleInfo = find(charInfo, (characterData) => {
      return characterData.style === style
    })
    const skills = styleInfo['passiveSkill_value']
    const foundSkillObject = find(skills, { value: skillValue })
    if (foundSkillObject) {
      skillName = foundSkillObject.names[settingStore.lang]
    } else {
      skillName = ''
    }
    return skillName
  }

  const getTargetImg = (tab, target) => {
    let targetImg = ''
    const team = charStore.selections[tab]
    const foundTargetObject = find(team, { character: target })
    const charInfo = foundTargetObject['character_info']
    targetImg = charInfo.icon || ''
    return targetImg
  }

  const checkCommandSkill = (row, col) => {
    let isCommandSkill = false
    const skillInfo = skillStore.skills[row][col]
    const skillValue = skillInfo.skill
    const tab = skillInfo.selectedTab
    const style = skillInfo.style
    const charInfo = charStore.selections[tab]
    const styleInfo = find(charInfo, (characterData) => {
      return characterData.style === style
    })
    const commandSkill = styleInfo['commandSkill']
    const foundSkillObject = find(commandSkill, { value: skillValue })
    if (foundSkillObject) {
      isCommandSkill = true
    } else {
      isCommandSkill = false
    }
    return isCommandSkill
  }

  const displaySkillName = (row, col) => {
    let skillName = ''
    const skillInfo = skillStore.skills[row][col]
    const skillValue = skillInfo.skill
    const tab = skillInfo.selectedTab
    const style = skillInfo.style
    const charInfo = charStore.selections[tab]
    const styleInfo = find(charInfo, (characterData) => {
      return characterData.style === style
    })
    const commandSkill = styleInfo['commandSkill']
    const skill = styleInfo['skill']
    const mergedSkills = [...commandSkill, ...skill]
    const foundSkillObject = find(mergedSkills, { value: skillValue })
    if (foundSkillObject) {
      skillName = foundSkillObject.names[settingStore.lang]
    } else {
      skillName = ''
    }
    return skillName
  }

  const formatOdDisplay = (turnValue, odValue) => {
    if (odValue === null) {
      return turnValue
    }

    const odOnlyRegex = /^OD\d+$/
    const bonusRegex = /^OD\d+\/Bonus(\d+)$/

    if (odOnlyRegex.test(odValue)) {
      return turnValue
    } else if (bonusRegex.test(odValue)) {
      const match = odValue.match(bonusRegex)
      if (match && match[1]) {
        return `${turnValue}\nBonus ${match[1]}`
      }
    }
    // Fallback for any other format or if regex fails
    return `${turnValue}\n${odValue}`
  }

  const getStyle = computed(() => (row) => ({
    'background-color': getBackgroundColor(row),
    ...(skillStore.turns[row - 1]?.turn === '追加回合' ? { padding: '3px 0px' } : {}),
  }))

  const emit = defineEmits(['close'])
  const closeTable = () => {
    if (isLoading.value) return
    isVisible.value = false
    setTimeout(() => {
      emit('close')
    }, 300)
  }
</script>

<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="isVisible" class="axle-overlay" @click="closeTable">
        <LoadingOverlay :visible="isLoading" text="Downloading..." type="half-circle" />
        <div class="container" @click.stop>
          <div class="button-group">
            <div class="left-button-group">
              <ShowTableFilter />
              <DownloadButton v-model:is-loading="isLoading" />
              <shareButton />
            </div>
            <button class="close" @click="closeTable">
              <img src="@/assets/custom-icon/close.svg" alt="Close" />
            </button>
          </div>
          <OverlayScrollbarsComponent class="table overlayscrollbars-vue" :options="scrollbarOptions" defer>
            <div v-if="uiStore.sliderRows <= 0" class="sleeping-image">
              <img src="/src/assets/common/sleeping.webp" />
            </div>
            <div v-else id="show-axle" class="table-wrapper">
              <div v-if="axleName.length > 0" class="axle-name text-wrap">{{ axleName }}</div>
              <div v-for="(selectedTab, index) in uiStore.showTeam" :key="selectedTab">
                <div
                  v-if="uiStore.showTeam.length > 1 && index > 0"
                  class="axle-line-container"
                  style="margin-top: 20px">
                  <div class="blue-line" />
                </div>
                <div class="table-container">
                  <div v-for="(i, colIndex) in 7" :key="colIndex" class="table-column">
                    <div class="character-container">
                      <div v-if="i === 1" />
                      <div v-else>
                        <img
                          v-if="charStore.selections[selectedTab][i - 1].img"
                          :src="getAssetsFile(charStore.selections[selectedTab][i - 1].img)"
                          :alt="charStore.selections[selectedTab][i - 1].style"
                          class="character-image" />
                        <!-- Rank -->
                        <div
                          v-if="hasRank() && charStore.selections[selectedTab][i - 1].rank !== null"
                          class="rank-text">
                          {{ charStore.selections[selectedTab][i - 1].rank }}
                        </div>
                        <div
                          v-else-if="
                            hasRank() &&
                            charStore.selections[selectedTab][i - 1].rank === null &&
                            charStore.selections[selectedTab][i - 1].style !== null
                          "
                          class="rank-text">
                          <span>0</span>
                        </div>
                        <img
                          v-if="hasRank() && charStore.selections[selectedTab][i - 1].flower"
                          src="/src/assets/common/flower.webp"
                          alt="flower"
                          class="flower-img" />
                        <!-- Spiritual -->
                        <div
                          v-if="hasSpiritual() && charStore.selections[selectedTab][i - 1].spiritual !== null"
                          class="spiritual-text">
                          {{ charStore.selections[selectedTab][i - 1].spiritual }}
                        </div>
                        <!-- Earring -->
                        <img
                          v-if="hasEarring() && charStore.selections[selectedTab][i - 1].earring !== null"
                          :src="getAssetsFile(earringDict[charStore.selections[selectedTab][i - 1].earring])"
                          :alt="charStore.selections[selectedTab][i - 1].earring"
                          class="earring-icon" />
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="hasPassiveSkill(selectedTab)" class="table-container" style="margin-top: 20px">
                  <div v-for="(i, colIndex) in 7" :key="colIndex" class="table-column">
                    <div v-if="i === 1" class="label text-wrap">Passive<br />Skill</div>
                    <div
                      v-else-if="
                        charStore.selections[selectedTab][i - 1].passiveSkill !== null &&
                        charStore.selections[selectedTab][i - 1].passiveSkill.length > 0
                      "
                      class="text">
                      <span
                        v-for="(skill, skillIndex) in charStore.selections[selectedTab][i - 1].passiveSkill"
                        :key="skillIndex"
                        class="passive-skill text-wrap">
                        {{
                          displayPassiveSkillName(selectedTab, skill, charStore.selections[selectedTab][i - 1].style)
                        }}
                      </span>
                    </div>
                  </div>
                </div>
                <!-- Used skill row -->
                <div
                  v-if="uiStore.showTag.includes('skill') && hasTeam(selectedTab)"
                  class="used-skill-bg table-container"
                  style="margin-top: 20px">
                  <div v-for="(i, colIndex) in 7" :key="colIndex" class="table-column">
                    <div v-if="i === 1" class="label text-wrap">Skill</div>
                    <div v-else-if="charStore.selections[selectedTab][i - 1].style !== null" class="text">
                      <span
                        v-for="(skill, skillIndex) in getUsedSkills(selectedTab)[
                          charStore.selections[selectedTab][i - 1].style
                        ]"
                        :key="skillIndex"
                        class="used-skill text-wrap">
                        {{ displayUsedSkillName(selectedTab, skill, charStore.selections[selectedTab][i - 1].style) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Axle -->
              <div v-if="uiStore.showTag.includes('axle')">
                <div
                  v-if="uiStore.sliderRows > 0 && uiStore.showTeam.length > 0"
                  class="axle-line-container"
                  style="margin-top: 20px">
                  <div class="red-line"></div>
                </div>
                <div
                  v-for="(turn, i) in skillStore.turns"
                  :key="turn.id"
                  :class="turn.turn !== 'Switch' ? 'table-container-2' : 'table-container-3'"
                  :style="getStyle(i + 1)">
                  <template v-if="turn.turn !== 'Switch'">
                    <div v-for="(col, colIndex) in 4" :key="colIndex" class="axle-table-column">
                      <div v-if="col === 1" class="label text-wrap">
                        <span v-if="turn.turn !== null" style="white-space: pre-line">
                          {{ formatOdDisplay(turn.turn, turn.od) }}
                        </span>
                        <span v-else-if="turn.turn === '追加回合'">{{ additionalTurn[settingStore.lang] }}</span>
                      </div>
                      <div v-else>
                        <span v-if="skillStore.skills[i][col - 2].skill !== null" class="axle-item">
                          <div class="image">
                            <img
                              :src="getAssetsFile(skillStore.skills[i][col - 2].style_img)"
                              :alt="skillStore.skills[i][col - 2].style"
                              class="axle-img" />
                          </div>
                          <div class="txt">
                            <span
                              class="axle-text text-wrap"
                              :style="{ opacity: checkCommandSkill(i, col - 2) ? '0.6' : '1' }">
                              {{ displaySkillName(i, col - 2) }}
                            </span>
                            <span v-if="skillStore.skills[i][col - 2].target !== null" class="axle-target-img-wrapper">
                              <img
                                :src="
                                  getAssetsFile(
                                    getTargetImg(
                                      skillStore.skills[i][col - 2].selectedTab,
                                      skillStore.skills[i][col - 2].target,
                                    ),
                                  )
                                "
                                class="axle-target-img" />
                            </span>
                          </div>
                        </span>
                      </div>
                    </div>
                  </template>
                  <div v-else>
                    <span class="switch-turn">{{ turn.turn }}</span>
                  </div>
                </div>
              </div>
            </div>
          </OverlayScrollbarsComponent>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style src="@vueform/multiselect/themes/default.css" />
<style scoped>
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  @keyframes modal-scale-in {
    from {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
  @keyframes modal-scale-out {
    from {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0;
    }
  }
  .modal-fade-enter-active .container {
    animation: modal-scale-in 0.3s ease;
  }
  .modal-fade-leave-active .container {
    animation: modal-scale-out 0.3s ease forwards;
  }
  .sleeping-image {
    position: relative;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .switch-turn {
    font-size: 36px;
    font-style: italic;
    font-weight: bold;
    color: rgb(255, 215, 0);
    font-family: 'Xiaolai', 'Noto Sans TC', sans-serif;
  }
  .character-container {
    position: relative;
  }
  .axle-name {
    font-size: 36px;
    text-align: center;
    margin: 0 auto 20px;
    padding: 0 24px;
    font-family: 'Xiaolai', 'Noto Sans TC', sans-serif;
    color: rgb(225, 230, 209);
    border-bottom: 4px solid rgb(110, 107, 102);
    max-width: 98%;
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
  .image {
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
    min-width: 720px;
    padding: 0.5rem 0;
  }
  .table-container {
    display: grid;
    grid-template-columns: 100px repeat(6, 1fr);
    margin: 0 10px;
    width: inherit;
    padding: 2px 0;
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
    max-width: 100%;
  }
  .axle-img {
    margin-right: 5px;
    height: 45px;
    width: 45px;
    vertical-align: middle;
  }
  .axle-target-img-wrapper {
    margin-left: 5px;
    height: 32px;
    width: 32px;
    vertical-align: middle;
    display: inline-block;
    position: relative;
    isolation: isolate;
  }
  .axle-target-img-wrapper::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(255, 255, 255);
    filter: blur(4px);
    border-radius: 50%;
    z-index: -1;
  }
  .axle-target-img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    position: relative;
    z-index: 1;
    display: block;
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
    font-family: 'Gugi', 'LXGW WenKai Mono TC', 'Noto Sans TC', sans-serif;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ddb0b0;
    height: 100%;
    max-width: 100px;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: normal;
    line-height: 1.2;
  }
  .label > span {
    display: block;
    width: 100%;
  }
  .text-wrap {
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: normal;
  }
  .character-image {
    display: block;
    width: 80px;
    height: 80px;
    object-fit: contain;
    z-index: -2;
    position: relative;
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
    background-color: rgba(51, 46, 48, 0.7);
    font-family: 'Xiaolai', 'Noto Sans TC', sans-serif;
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
    text-shadow:
      0 0 4px rgb(0, 0, 0),
      0 0 8px rgb(0, 0, 0),
      0 0 16px rgb(0, 0, 0);
  }
  .rank-text::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    background-color: rgba(201, 198, 200, 0.8);
    filter: blur(4px);
    border-radius: 50%;
    z-index: -1;
  }
  .spiritual-text {
    position: absolute;
    bottom: -12px;
    right: 35px;
    background-color: transparent;
    background-image: url(@/assets/common/soul.webp);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    font-family: 'Xiaolai', 'Noto Sans TC', sans-serif;
    color: rgb(249, 228, 244);
    width: 29px;
    height: 29px;
    padding: 0;
    border-radius: 50%;
    font-size: 20px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    text-shadow:
      0 0 4px rgb(0, 0, 0),
      0 0 8px rgb(0, 0, 0),
      0 0 16px rgb(0, 0, 0);
    filter: drop-shadow(0 0 12px rgb(234, 120, 124));
  }
  .used-skill-bg {
    background: rgba(113, 108, 122, 0.3);
    border-radius: 10px;
  }
  .used-skill {
    color: #fff;
    margin: 3px;
    padding: 2px 8px;
    background-color: #312828;
    border-radius: 4px;
    border: 2px solid rgb(86, 64, 64);
  }
  .passive-skill {
    margin: 3px;
    padding: 2px 8px;
    background-color: #2d3851;
    color: #fff;
    border-radius: 4px;
    border: 2px solid rgb(54, 71, 122);
  }
  .axle-text {
    font-size: 18px;
    font-weight: normal;
    height: 100%;
    vertical-align: middle;
    color: #fff;
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
  .button-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-4);
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
  .axle-overlay {
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
    background-color: var(--bg-color-dark);
    height: auto;
    max-height: 95%;
    width: 70%;
    max-width: 1024px;
    padding-bottom: var(--spacing-4);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    border: 3px solid var(--border-color-dark-cyan);
  }
  .table {
    display: flex;
    height: 100%;
    width: 100%;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 3%, black 98%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, black 3%, black 98%, transparent 100%);
  }

  @media (max-width: 950px) {
    .container {
      width: 100%;
      height: auto;
      max-width: none;
    }
  }
</style>
