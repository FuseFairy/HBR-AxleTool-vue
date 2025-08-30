<script setup>
  import { ref, nextTick, toRaw } from 'vue'
  import { useSliderStore } from '@/store/slider'
  import { useSkillStore } from '@/store/axle'
  import { useCharStore } from '@/store/char'
  import { useSettingStore } from '@/store/setting'
  import { v4 as uuidv4 } from 'uuid'
  import Multiselect from '@vueform/multiselect'
  import SelectAxleChar from '@/components/modal/SelectAxleChar.vue'
  import { getAssetsFile } from '@/utils/assets/getAssetsFile'
  import { getTargetOptions } from '@/utils/state-getters/getTargetOptions'
  import { isDesktop } from '@tenrok/vue3-device-detect'
  import { cloneDeep } from 'lodash-es'

  const sliderStore = useSliderStore()
  const skillStore = useSkillStore()
  const charStore = useCharStore()
  const settingStore = useSettingStore()
  const odOptions = [
    'OD1',
    'OD1/Bonus1',
    'OD2',
    'OD2/Bonus1',
    'OD2/Bonus2',
    'OD3',
    'OD3/Bonus1',
    'OD3/Bonus2',
    'OD3/Bonus3',
  ]
  const options = Array.from({ length: 80 }, (_, i) => `T${i + 1}`)
  const formattedOptions = options.map((option) => {
    return {
      value: option,
      names: option,
    }
  })
  const turnOptions = [
    { value: 'Switch', names: 'Switch' },
    { value: '追加回合', names: { 'zh-TW': '追加回合', jp: '追加ターン', 'zh-CN-CN': '追加回合' } },
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
    const currentSkillInfo = skillStore.skills[row][key]
    if (currentSkillInfo && currentSkillInfo.style != null) {
      const { style: currentStyle, selectedTab, style_id, activeFormId } = currentSkillInfo
      const selections = Object.values(charStore.selections[selectedTab])

      const currentSelection = selections.find((selection) => selection.style === currentStyle)
      let skillOptions = cloneDeep(currentSelection.skill)

      if (Array.isArray(style_id)) {
        skillOptions = skillOptions.filter((skill) => !skill.owner || skill.owner === activeFormId)
      }

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

  const deleteRow = (index) => {
    sliderStore.rows -= 1
    skillStore.turns.splice(index, 1)
    skillStore.skills.splice(index, 1)
  }

  const copyRow = (index) => {
    sliderStore.rows += 1
    const copiedTurn = cloneDeep(skillStore.turns[index])
    copiedTurn.id = uuidv4()
    const copiedSkill = cloneDeep(skillStore.skills[index])
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
      skillStore.skills[index] = [
        {
          selectedTab: null,
          style: null,
          style_id: null,
          activeFormId: null,
          style_img: null,
          skill: null,
          target: null,
        },
        {
          selectedTab: null,
          style: null,
          style_id: null,
          activeFormId: null,
          style_img: null,
          skill: null,
          target: null,
        },
        {
          selectedTab: null,
          style: null,
          style_id: null,
          activeFormId: null,
          style_img: null,
          skill: null,
          target: null,
        },
      ]
      skillStore.turns[index].od = null
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

  // 拖曳和觸控相關邏輯
  const mouseOnButton = ref(null) // 記錄源按鈕的 { row, key }
  const mouseDownButton = ref(null) // 記錄目標按鈕的 { row, key }
  const touchElement = ref(null) // 記錄正在拖曳的影子元素
  const touchOffset = ref({ x: 0, y: 0 }) // 記錄觸控點相對元素的偏移
  const dragImage = ref(null) // 記錄拖曳圖片元素

  // HTML5 Drag and Drop 事件（滑鼠）
  function handleDragStart(e, row, key) {
    mouseOnButton.value = { row, key }
    e.dataTransfer.setData('text/plain', null)
    e.dataTransfer.effectAllowed = 'move'

    const clone = e.target.cloneNode(true)
    clone.style.opacity = '0.8'
    clone.style.position = 'absolute'
    clone.style.left = '-9999px'
    document.body.appendChild(clone)
    dragImage.value = clone
    e.dataTransfer.setDragImage(clone, 40, 40)

    e.target.classList.add('dragging')
  }

  function handleDragOver(e, row, key) {
    e.preventDefault()
    mouseDownButton.value = { row, key }
  }

  function handleDragEnd(e) {
    e.target.classList.remove('dragging')
    if (dragImage.value) {
      dragImage.value.remove()
      dragImage.value = null
    }
    swapButtons()
  }

  // 觸控事件
  function handleTouchStart(e, row, key) {
    const touch = e.touches[0]
    const target = e.target.closest('.circle-button')
    mouseOnButton.value = { row, key }

    // 創建影子元素
    const clone = target.cloneNode(true)
    clone.classList.add('drag-shadow')
    document.body.appendChild(clone)
    touchElement.value = clone

    const rect = target.getBoundingClientRect()
    touchOffset.value = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }
    target.classList.add('dragging')
    document.body.style.overflow = 'hidden' // 禁用頁面滾動
  }

  function handleTouchMove(e) {
    if (!touchElement.value) return

    const touch = e.touches[0]
    // 移動影子元素
    touchElement.value.style.position = 'fixed'
    touchElement.value.style.left = `${touch.clientX - touchOffset.value.x}px`
    touchElement.value.style.top = `${touch.clientY - touchOffset.value.y}px`
    touchElement.value.style.zIndex = '1000'

    // 碰撞檢測
    touchElement.value.style.pointerEvents = 'none'
    const target = document.elementFromPoint(touch.clientX, touch.clientY)
    touchElement.value.style.pointerEvents = ''

    const button = target?.closest('.circle-button')
    if (button) {
      const row = parseInt(button.dataset.row, 10)
      const key = parseInt(button.dataset.key, 10)
      if (key !== mouseOnButton.value.key) {
        mouseDownButton.value = { row, key }
      } else {
        mouseDownButton.value = null
      }
    } else {
      mouseDownButton.value = null
    }
  }

  function handleTouchEnd() {
    document.body.style.overflow = '' // 恢復頁面滾動
    if (touchElement.value) {
      touchElement.value.remove() // 移除影子元素
      const sourceButton = document.querySelector(
        `.circle-button[data-row="${mouseOnButton.value.row}"][data-key="${mouseOnButton.value.key}"]`
      )
      if (sourceButton) {
        sourceButton.classList.remove('dragging')
      }
      swapButtons()
      touchElement.value = null
    }
  }

  // 交換按鈕數據
  function swapButtons() {
    if (
      mouseOnButton.value === null ||
      mouseDownButton.value === null ||
      mouseOnButton.value.key === mouseDownButton.value.key
    ) {
      mouseOnButton.value = null
      mouseDownButton.value = null
      return
    }

    console.log('Swapping:', {
      source: mouseOnButton.value,
      target: mouseDownButton.value,
    })

    const sourceRow = mouseOnButton.value.row
    const sourceKey = mouseOnButton.value.key
    const targetRow = mouseDownButton.value.row
    const targetKey = mouseDownButton.value.key

    const temp = { ...skillStore.skills[sourceRow][sourceKey] }
    skillStore.skills[sourceRow][sourceKey] = { ...skillStore.skills[targetRow][targetKey] }
    skillStore.skills[targetRow][targetKey] = temp

    mouseOnButton.value = null
    mouseDownButton.value = null
  }

  const toggleForm = (row, key) => {
    const skill = skillStore.skills[row][key]
    if (!Array.isArray(skill.style_id) || !skill.style_img) return

    const currentIndex = skill.style_id.indexOf(skill.activeFormId)
    const nextIndex = (currentIndex + 1) % skill.style_id.length
    const newActiveFormId = skill.style_id[nextIndex]
    skill.activeFormId = newActiveFormId

    const pathParts = skill.style_img.split('/')
    pathParts.pop()
    skill.style_img = `${pathParts.join('/')}/${newActiveFormId}.webp`
  }
</script>

<template>
  <div
    v-for="(turn, i) in skillStore.turns"
    :key="turn.id"
    v-slide-in
    :class="[
      'container row-item',
      {
        'grid-disabled': turn.turn === 'Switch',
        od1: turn.od && turn.od.startsWith('OD1'),
        od2: turn.od && turn.od.startsWith('OD2'),
        od3: turn.od && turn.od.startsWith('OD3'),
      },
    ]"
  >
    <button v-tooltip="{ content: 'delete', placement: 'bottom' }" class="delete-button" @click="deleteRow(i)">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
        <path
          d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"
        />
      </svg>
    </button>
    <button v-tooltip="{ content: 'copy', placement: 'bottom' }" class="copy-button" @click="copyRow(i)">
      <img src="@/assets/custom-icon/copy.svg" alt="copy" />
    </button>
    <div class="column">
      <div :class="['empty-1', { 'empty-2': turn.turn === 'Switch' }]">
        <template v-if="turn.turn !== 'Switch'">
          <button
            v-tooltip="{ content: 'up', placement: 'top' }"
            class="arrow-button"
            :disabled="i === 0"
            @click="exchange(i, 'up')"
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
            v-tooltip="{ content: 'down', placement: 'bottom' }"
            class="arrow-button"
            :disabled="i === skillStore.turns.length - 1"
            @click="exchange(i, 'down')"
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
        v-model="turn.turn"
        placeholder="Turn"
        :options="turnOptions"
        label="names"
        track-by="value"
        :locale="settingStore.lang"
        fallback-locale="zh-TW"
        @update:model-value="(value) => handleTurnChange(value, i)"
      />
      <Multiselect v-if="turn.turn !== 'Switch'" v-model="turn.od" placeholder="OD" :options="odOptions" />
    </div>
    <div v-if="turn.turn !== 'Switch'" class="button-container">
      <div v-for="n in 3" :key="n" class="column">
        <div class="char-button-wrapper">
          <div
            role="button"
            tabindex="0"
            :data-row="i"
            :data-key="n - 1"
            :class="{
              'circle-button selected-button': skillStore.skills[i][n - 1].style_img !== null,
              'circle-button add-button': skillStore.skills[i][n - 1].style_img === null,
            }"
            draggable="true"
            @click="handleBoxClick(i, n - 1)"
            @dragstart="handleDragStart($event, i, n - 1)"
            @dragover.prevent="handleDragOver($event, i, n - 1)"
            @dragend="handleDragEnd($event, i, n - 1)"
            @touchstart="handleTouchStart($event, i, n - 1)"
            @touchmove="handleTouchMove($event)"
            @touchend="handleTouchEnd($event)"
            @keydown.enter="handleBoxClick(i, n - 1)"
            @keydown.space="handleBoxClick(i, n - 1)"
          >
            <img
              v-if="skillStore.skills[i][n - 1].style_img !== null"
              class="char-img"
              :src="getAssetsFile(skillStore.skills[i][n - 1].style_img)"
              :alt="skillStore.skills[i][n - 1].style"
            />
            <img v-else class="icon-img" src="@/assets/custom-icon/add.svg" alt="Add" />
          </div>
          <button
            v-if="Array.isArray(skillStore.skills[i][n - 1].style_id)"
            v-tooltip="{ content: 'switch style', placement: 'top' }"
            class="toggle-form-button"
            @click.stop="toggleForm(i, n - 1)"
          >
            <img src="@/assets/custom-icon/switch.svg" alt="Toggle Form" />
          </button>
        </div>
        <Multiselect
          v-model="skillStore.skills[i][n - 1].skill"
          placeholder="Skill"
          label="names"
          track-by="value"
          :searchable="isDesktop"
          :options="getFilteredSkills(i, n - 1)"
        >
          <template #singlelabel="{ value }">
            <div class="multiselect-single-label">
              <span :title="value.names[settingStore.lang]">{{ value.names[settingStore.lang] }}/{{ value.sp }}sp</span>
            </div>
          </template>
          <template #option="{ option }">
            <span :title="option.names[settingStore.lang]"
              >{{ option.names[settingStore.lang] }}/{{ option.sp }}sp</span
            >
          </template>
        </Multiselect>
        <Multiselect
          v-model="skillStore.skills[i][n - 1].target"
          placeholder="Target"
          label="names"
          track-by="value"
          :options="getTargetOptions(i, n - 1)"
        >
          <template #singlelabel="{ value }">
            <div class="multiselect-single-label">
              <img class="label-icon" :src="getAssetsFile(value.icon)" />
              <span :title="value.names[settingStore.lang]">{{ value.names[settingStore.lang] }}</span>
            </div>
          </template>
          <template #option="{ option }">
            <img class="option-icon" :src="getAssetsFile(option.icon)" />
            <span :title="option.names[settingStore.lang]">{{ option.names[settingStore.lang] }}</span>
          </template>
        </Multiselect>
      </div>
    </div>
  </div>
  <SelectAxleChar
    v-if="activeComponent.row !== null"
    :row="activeComponent.row"
    :button-key="activeComponent.buttonKey"
    @close="closeContainer"
  />
</template>

<style src="@vueform/multiselect/themes/default.css" />
<style scoped>
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
    grid-template-columns: 160px 1fr;
    align-items: center;
    transition: box-shadow 0.3s ease;
  }
  .container::before {
    content: '';
    position: absolute;
    inset: 0;
    backdrop-filter: blur(2px);
    z-index: -1;
    border-radius: inherit;
  }
  .grid-disabled {
    grid-template-columns: none !important;
    border-left: 2px solid rgba(255, 215, 0, 1);
  }
  .od1 {
    border-left: 3px solid rgba(235, 173, 222, 0.9);
    border-right: 3px solid rgba(235, 173, 222, 0.9);
  }
  .od2 {
    border-left: 3px solid rgba(145, 225, 176, 0.9);
    border-right: 3px solid rgba(145, 225, 176, 0.9);
  }
  .od3 {
    border-left: 3px solid rgba(255, 246, 161, 0.9);
    border-right: 3px solid rgba(255, 246, 161, 0.9);
  }
  .container:hover {
    box-shadow:
      0 0 0 0.5px #c12277,
      0 0 20px rgba(240, 152, 199, 0.5);
  }
  .button-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .column {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .char-button-wrapper {
    position: relative;
  }
  .toggle-form-button {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    width: 28px;
    height: 28px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    z-index: 10;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
  .toggle-form-button:hover {
    background-color: rgba(50, 50, 50, 0.95);
    border-color: rgba(255, 255, 255, 0.7);
    box-shadow: 0 2px 12px rgba(255, 255, 255, 0.1);
  }
  .toggle-form-button img {
    width: 100%;
    height: 100%;
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
    touch-action: none;
  }
  .circle-button.dragging {
    opacity: 0.6;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  }
  .drag-shadow {
    position: fixed;
    opacity: 0.8;
    pointer-events: none;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
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
      grid-template-columns: 120px 1fr;
    }
    .button-container {
      grid-template-columns: repeat(3, 1fr);
    }
    .circle-button {
      width: 60px;
      height: 60px;
      font-size: 14px;
    }
    .drag-shadow {
      width: 60px;
      height: 60px;
    }
    .empty-1 {
      width: 60px;
      height: 60px;
    }
  }
</style>
