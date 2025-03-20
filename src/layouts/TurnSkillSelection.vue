<script setup>
  import { ref, nextTick, toRaw } from 'vue'
  import { useSliderStore } from '@/store/slider'
  import { useSkillStore } from '@/store/axle'
  import { useCharStore } from '@/store/char'
  import { useSettingStore } from '@/store/setting'
  import Multiselect from '@vueform/multiselect'
  import SelectAxleChar from '@/components/modal/SelectAxleChar.vue'
  import { getAssetsFile } from '@/utils/getAssetsFile'
  import { cloneDeep, get, isEmpty, filter, map } from 'lodash-es'

  const sliderStore = useSliderStore()
  const skillStore = useSkillStore()
  const charStore = useCharStore()
  const settingStore = useSettingStore()
  const odOptions = ['OD1', 'OD2', 'OD3']

  const options = Array.from({ length: 80 }, (_, i) => `T${i + 1}`)
  const formattedOptions = options.map((option) => {
    return {
      value: option,
      names: option,
    }
  })
  const turnOptions = [
    { value: 'Switch', names: 'Switch' },
    { value: '追加回合', names: { 'zh-TW': '追加回合', jp: '追加ターン' } },
    ...formattedOptions,
  ]

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
      const skillOptions = cloneDeep(currentSelection.skill)
      const commandSkillRaw = toRaw(currentSelection.commandSkill)

      if (Array.isArray(commandSkillRaw)) {
        commandSkillRaw.forEach((skill) => {
          skillOptions.unshift(skill)
        })
      } else if (commandSkillRaw) {
        skillOptions.unshift(commandSkillRaw)
      }

      const foundSkill = skillOptions.some((option) => option.value === skillStore.skills[row][key].skill)
      if (!foundSkill) {
        skillStore.skills[row][key].skill = null
      }

      return skillOptions
    } else {
      skillStore.skills[row][key].skill = null

      return []
    }
  }

  const targetOptions = (row, key) => {
    const currentSkill = skillStore.skills[row][key]
    const style = get(currentSkill, 'style')

    if (currentSkill && style != null) {
      const selectedTab = currentSkill['selectedTab']
      const team = charStore.selections[`${selectedTab}`]

      const charOptions = filter(
        map(Object.values(team), (teamObject) => teamObject.character_info),
        (characterInfo) => !isEmpty(characterInfo)
      )

      return charOptions
    } else {
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
    const copiedTurn = _cloneDeep(skillStore.turns[index])
    const copiedSkill = _cloneDeep(skillStore.skills[index])
    skillStore.turns.splice(index + 1, 0, copiedTurn)
    skillStore.skills.splice(index + 1, 0, copiedSkill)

    nextTick(async () => {
      await nextTick()
      scrollToCopiedRow(index + 1)
    })
  }

  const scrollToCopiedRow = (targetIndex) => {
    const rowElements = document.querySelectorAll('.row-item')
    if (rowElements[targetIndex]) {
      rowElements[targetIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

  function handleTurnChange(value, index) {
    if (value === 'Switch') {
      skillStore.skills[index - 1] = [
        { selectedTab: null, style: null, style_img: null, skill: null, target: null },
        { selectedTab: null, style: null, style_img: null, skill: null, target: null },
        { selectedTab: null, style: null, style_img: null, skill: null, target: null },
      ]
    }
  }

  const exchange = (row, direction) => {
    const currentRow = skillStore.skills[row]
    let swapIndex
    let directionModifier = 0

    if (direction === 'up') {
      directionModifier = -1
    } else {
      directionModifier = 1
    }

    if (skillStore.turns[row + directionModifier].turn === 'Switch') {
      swapIndex = row + directionModifier * 2
    } else {
      swapIndex = row + directionModifier
    }

    const swapRow = skillStore.skills[swapIndex]
    ;[skillStore.skills[row], skillStore.skills[swapIndex]] = [swapRow, currentRow]
  }
</script>

<template>
  <div
    v-for="i in sliderStore.rows"
    :key="i"
    :class="['container row-item', { 'grid-disabled': skillStore.turns[i - 1].turn === 'Switch' }]"
  >
    <button class="delete-button" @click="deleteRow(i - 1)" v-tooltip="{ content: 'delete', placement: 'bottom' }">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
        <path
          d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"
        />
      </svg>
    </button>
    <button class="copy-button" @click="copyRow(i - 1)" v-tooltip="{ content: 'copy', placement: 'bottom' }">
      <img src="@/assets/custom-icon/copy.svg" alt="copy" />
    </button>
    <div class="column">
      <div :class="['empty-1', { 'empty-2': skillStore.turns[i - 1].turn === 'Switch' }]">
        <template v-if="skillStore.turns[i - 1].turn !== 'Switch'">
          <button
            class="arrow-button"
            :disabled="i === 1"
            @click="exchange(i - 1, 'up')"
            v-tooltip="{ content: 'up', placement: 'top' }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="21px"
              weight="21px"
              fill-opacity="0.85"
              viewBox="280 -600 400 200"
            >
              <path d="m280-400 200-200 200 200H280Z" />
            </svg>
          </button>
          <button
            class="arrow-button"
            :disabled="sliderStore.rows === i"
            @click="exchange(i - 1, 'down')"
            v-tooltip="{ content: 'down', placement: 'bottom' }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="21px"
              weight="21px"
              fill-opacity="0.85"
              viewBox="280 -560 400 200"
            >
              <path d="M480-360 280-560h400L480-360Z" />
            </svg>
          </button>
        </template>
      </div>
      <Multiselect
        v-model="skillStore.turns[i - 1].turn"
        placeholder="Turn"
        :options="turnOptions"
        label="names"
        track-by="value"
        :locale="settingStore.lang"
        fallback-locale="zh-TW"
        @update:model-value="(value) => handleTurnChange(value, i)"
      />
      <Multiselect
        v-if="skillStore.turns[i - 1].turn !== 'Switch'"
        v-model="skillStore.turns[i - 1].od"
        placeholder="OD"
        :options="odOptions"
      />
    </div>
    <div class="column" v-if="skillStore.turns[i - 1].turn !== 'Switch'" v-for="n in 3" :key="n">
      <button
        @click="handleBoxClick(i - 1, n - 1)"
        :class="{
          'circle-button selected-button': skillStore.skills[i - 1][n - 1].style_img !== null,
          'circle-button add-button': skillStore.skills[i - 1][n - 1].style_img === null,
        }"
      >
        <img
          v-if="skillStore.skills[i - 1][n - 1].style_img !== null"
          class="char-img"
          :src="getAssetsFile(skillStore.skills[i - 1][n - 1].style_img)"
          :alt="skillStore.skills[i - 1][n - 1].style"
        />
        <img v-else class="icon-img" src="@/assets/custom-icon/add.svg" alt="Add" />
      </button>
      <Multiselect
        v-model="skillStore.skills[i - 1][n - 1].skill"
        placeholder="Skill"
        label="names"
        track-by="value"
        :searchable="true"
        :options="getFilteredSkills(i - 1, n - 1)"
      >
        <template v-slot:singlelabel="{ value }">
          <div class="multiselect-single-label">
            <span :title="value.names[settingStore.lang]">{{ value.names[settingStore.lang] }}/{{ value.sp }}sp</span>
          </div>
        </template>

        <template v-slot:option="{ option }">
          <span :title="option.names[settingStore.lang]">{{ option.names[settingStore.lang] }}/{{ option.sp }}sp</span>
        </template>
      </Multiselect>
      <Multiselect
        v-model="skillStore.skills[i - 1][n - 1].target"
        placeholder="Target"
        label="names"
        track-by="value"
        :options="targetOptions(i - 1, n - 1)"
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
    transition: box-shadow 0.3s ease;
  }
  .grid-disabled {
    grid-template-columns: none !important;
    border-left: 2px solid rgba(255, 215, 0, 1);
  }
  .container:hover {
    box-shadow:
      0 0 0 0.5px #c12277,
      0 0 20px rgba(240, 152, 199, 0.5);
  }
  .column {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .empty-1 {
    width: 80px;
    height: 80px;
    overflow: hidden;
    row-gap: 10px;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
  }
  div.empty-2 {
    width: 20px;
    height: 20px;
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
    fill: rgb(239, 67, 58);
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
    filter: brightness(1.2);
  }
  .arrow-button {
    background-color: transparent;
    cursor: pointer;
    align-content: center;
    justify-content: center;
    border: none;
    fill: #d3d3d3;
  }
  .arrow-button:hover svg {
    filter: brightness(2);
  }
  .arrow-button:disabled svg {
    cursor: not-allowed;
    opacity: 0.4;
    filter: none;
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
    .empty-1 {
      width: 60px;
      height: 60px;
    }
  }
</style>
