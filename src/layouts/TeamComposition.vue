<script setup>
  import { ref, computed } from 'vue'
  import { useCharStore } from '@/store/char'
  import { useLastTabStore } from '@/store/tab'
  import SelectChar from '@/components/modal/SelectChar.vue'
  import { getAssetsFile } from '@/utils/getAssetsFile'
  import { fetchSkillOptions } from '@/utils/fetchSkillOptions'
  import { toast } from 'vue3-toastify'
  import 'vue3-toastify/dist/index.css'
  import { fetchCommandSkill } from '@/utils/fetchCommandSkill'

  const charStore = useCharStore()
  const lastTabStore = useLastTabStore()

  const buttons = Array.from({ length: 6 }, (_, i) => ({ key: i + 1, label: `Button ${i + 1}` }))
  const tabs = Array.from({ length: 6 }, (_, i) => ({ key: i + 1, label: `Team ${i + 1}` }))

  const activeComponent = ref(null)

  const selectedTab = computed({
    get() {
      return lastTabStore.box_lastTab || 1
    },
    set(key) {
      lastTabStore.box_lastTab = key
    },
  })

  const selectTab = (key) => {
    selectedTab.value = key
  }

  const handleBoxClick = (key) => {
    activeComponent.value = key
  }

  const closeContainer = () => {
    activeComponent.value = null
  }

  // 拖曳相關邏輯
  const draggedKey = ref(null)
  const dragImage = ref(null)
  const touchElement = ref(null) // 記錄正在拖曳的影子元素
  const touchOffset = ref({ x: 0, y: 0 }) // 記錄觸控點相對元素的偏移
  const mouseOnButton = ref(null) // 記錄源按鈕的 key
  const potentialDropTargetKey = ref(null) // 記錄潛在的目標按鈕的 key

  // HTML5 Drag and Drop 事件（滑鼠）
  function handleDragStart(e, key) {
    draggedKey.value = key
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', key)

    const clone = e.target.cloneNode(true)
    clone.style.opacity = '0.8'
    clone.style.position = 'absolute'
    clone.style.left = '-9999px'
    document.body.appendChild(clone)
    dragImage.value = clone
    e.dataTransfer.setDragImage(clone, 60, 60)

    e.target.classList.add('dragging')
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e, key) {
    e.preventDefault()
    const sourceKey = draggedKey.value
    const targetKey = key

    if (sourceKey !== targetKey) {
      const currentTab = selectedTab.value
      const temp = { ...charStore.selections[currentTab][sourceKey] }
      charStore.selections[currentTab][sourceKey] = { ...charStore.selections[currentTab][targetKey] }
      charStore.selections[currentTab][targetKey] = temp
    }
  }

  function handleDragEnd(e) {
    e.target.classList.remove('dragging')
    draggedKey.value = null
    if (dragImage.value) {
      dragImage.value.remove()
      dragImage.value = null
    }
  }

  // 觸控事件
  function handleTouchStart(e, key) {
    const touch = e.touches[0]
    const target = e.target.closest('.team-circle-button')
    mouseOnButton.value = key
    potentialDropTargetKey.value = null // Initialize potentialDropTargetKey

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

    const button = target?.closest('.team-circle-button')
    if (button) {
      const targetKey = parseInt(button.dataset.key, 10)
      if (targetKey && targetKey !== mouseOnButton.value) {
        potentialDropTargetKey.value = targetKey
      } else {
        potentialDropTargetKey.value = null
      }
    } else {
      potentialDropTargetKey.value = null
    }
  }

  function handleTouchEnd() {
    document.body.style.overflow = '' // 恢復頁面滾動
    if (touchElement.value) {
      touchElement.value.remove() // 移除影子元素
      const sourceButton = document.querySelector(`.team-circle-button[data-key="${mouseOnButton.value}"]`)
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
      potentialDropTargetKey.value === null ||
      mouseOnButton.value === potentialDropTargetKey.value
    ) {
      mouseOnButton.value = null
      potentialDropTargetKey.value = null
      return
    }

    console.log('Swapping:', {
      source: mouseOnButton.value,
      target: potentialDropTargetKey.value,
    })

    const currentTab = selectedTab.value
    const sourceKey = mouseOnButton.value
    const targetKey = potentialDropTargetKey.value
    const temp = { ...charStore.selections[currentTab][sourceKey] }
    charStore.selections[currentTab][sourceKey] = { ...charStore.selections[currentTab][targetKey] }
    charStore.selections[currentTab][targetKey] = temp

    mouseOnButton.value = null
    potentialDropTargetKey.value = null
  }

  const isRefreshing = ref(false)
  async function refreshData() {
    if (isRefreshing.value) return

    const currentTab = lastTabStore.box_lastTab
    const Team = charStore.selections[currentTab]

    const refreshPromise = async () => {
      isRefreshing.value = true
      try {
        const allCharacterPromises = []
        for (const charKey in Team) {
          const { character, team, style } = Team[charKey]

          if (style) {
            const skillPromise = fetchSkillOptions(character, team, style)
            const commandSkillPromise = fetchCommandSkill(character, team, style)

            allCharacterPromises.push(
              Promise.all([skillPromise, commandSkillPromise])
                .then(([skillOptions, commandSkill]) => {
                  charStore.selections[currentTab][charKey]['skill'] = skillOptions
                  charStore.selections[currentTab][charKey]['commandSkill'] = commandSkill
                })
                .catch((error) => {
                  console.error(`Error fetching data for ${character} in team ${team} with style ${style}:`, error)
                  throw error
                })
            )
          }
        }

        await Promise.all(allCharacterPromises)
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      } finally {
        isRefreshing.value = false
      }
    }

    toast.promise(
      refreshPromise,
      {
        pending: 'Refreshing Skill Options...',
        success: {
          render() {
            return `Skill options successfully refreshed!`
          },
          icon: '🚀',
          theme: 'colored',
          type: 'success',
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1500,
          dangerouslyHTMLString: true,
          newestOnTop: true,
          toastStyle: {
            backgroundColor: 'rgba(22, 21, 24, 0.9)',
            'font-family': 'LXGW WenKai Mono TC',
            color: 'rgb(248, 216, 251)',
          },
          progressStyle: {
            backgroundColor: 'rgb(180, 68, 191)',
          },
        },
        error: {
          render() {
            return 'Skill options refresh failed!'
          },
          icon: '🔥',
          theme: 'colored',
          type: 'error',
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
          dangerouslyHTMLString: true,
          newestOnTop: true,
          toastStyle: {
            backgroundColor: 'rgba(22, 21, 24, 0.9)',
            'font-family': 'LXGW WenKai Mono TC',
            color: 'rgb(248, 216, 251)',
          },
          progressStyle: {
            backgroundColor: 'rgb(255, 88, 88)',
          },
        },
      },
      {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'colored',
        toastStyle: {
          backgroundColor: 'rgba(22, 21, 24, 0.9)',
          'font-family': 'LXGW WenKai Mono TC',
          color: 'rgb(248, 216, 251)',
        },
      }
    )
  }
</script>

<template>
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

  <div class="tool-container">
    <button
      v-tooltip="{ content: 'Refresh Skill Options', placement: 'bottom' }"
      class="refresh-button"
      @click="refreshData"
    >
      <img src="@/assets/custom-icon/update.svg" alt="refresh" :class="{ spin: isRefreshing }" />
    </button>
  </div>

  <div class="button-container">
    <div
      v-for="button in buttons"
      :key="button.key"
      :data-key="button.key"
      :class="{
        'team-circle-button': true,
        'selected-button': charStore.selections[selectedTab][button.key]?.img !== null,
        'add-button': charStore.selections[selectedTab][button.key]?.img === null,
      }"
      draggable="true"
      role="button"
      tabindex="0"
      @dragstart="handleDragStart($event, button.key)"
      @dragover="handleDragOver($event)"
      @drop="handleDrop($event, button.key)"
      @dragend="handleDragEnd($event)"
      @touchstart="handleTouchStart($event, button.key)"
      @touchmove="handleTouchMove($event)"
      @touchend="handleTouchEnd($event)"
      @click="handleBoxClick(button.key)"
      @keydown.enter="handleBoxClick(button.key)"
      @keydown.space="handleBoxClick(button.key)"
    >
      <img
        v-if="charStore.selections[selectedTab][button.key]?.img !== null"
        class="char-img"
        :src="getAssetsFile(charStore.selections[selectedTab][button.key].img)"
        :alt="charStore.selections[selectedTab][button.key]?.style"
      />
      <img v-else class="icon-img" src="@/assets/custom-icon/add.svg" alt="Add" />
    </div>
  </div>

  <SelectChar
    v-if="activeComponent !== null"
    :button-key="activeComponent"
    :selected-tab="selectedTab"
    @close="closeContainer"
  />
</template>

<style scoped>
  .tabs {
    display: flex;
    gap: 0;
    border-bottom: 2px solid var(--border-color-light-gray);
  }
  button.refresh-button {
    background-color: transparent;
    padding: 1px;
    border: none;
    box-sizing: border-box;
    height: 35px;
    width: 35px;
    cursor: pointer;
    border-radius: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  button.refresh-button:hover {
    background-color: var(--bg-color-light-gray-transparent);
  }
  button.tab {
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    background-color: transparent;
    color: white;
    transition: background-color 0.3s ease;
    flex-grow: 1;
    font-family: var(--font-family-serif);
    font-size: 18px;
    border-radius: 10px 10px 0 0;
  }
  button.tab.active {
    background-color: var(--bg-color-light-gray);
    color: var(--text-color-dark);
  }
  button.tab:hover {
    background-color: var(--bg-color-medium-light-gray);
    color: var(--text-color-dark);
  }
  .button-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: var(--spacing-5);
    justify-items: center;
    align-items: center;
    height: auto;
    padding-top: var(--spacing-3);
    position: relative;
  }
  .tool-container {
    display: flex;
    height: auto;
    padding-top: var(--spacing-3);
    justify-content: right;
    align-items: center;
  }
  .team-circle-button {
    border-radius: 50%;
    width: min(100%, 120px);
    aspect-ratio: 1 / 1;
    font-size: 16px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-color-dark-transparent-2);
    touch-action: none;
  }
  .team-circle-button.dragging {
    opacity: 0.6;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  }
  .drag-shadow {
    position: fixed;
    opacity: 0.8;
    pointer-events: none;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-color-dark-transparent-2);
  }
  .selected-button {
    border: none;
    transition: transform 0.3s ease;
    box-shadow: 0 0 10px var(--box-shadow-purple-light);
  }
  .selected-button:hover {
    box-shadow: 0 0 15px var(--box-shadow-purple-light);
  }
  .selected-button:hover .char-img {
    transform: scale(1.1);
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
    background-color: var(--bg-color-light-gray-transparent-2);
  }
  .add-button:hover .icon-img {
    filter: var(--filter-invert-1);
  }
  .icon-img {
    width: 50px;
    height: 50px;
  }
  :global(:root) {
    --toastify-spinner-color: #9d49ce;
    --toastify-spinner-color-empty-area: transparent;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .spin {
    animation: spin 0.2s ease-in-out;
  }
  @media (max-width: 800px) {
    .button-container {
      grid-template-columns: repeat(3, 1fr);
    }
    .team-circle-button {
      width: 80px;
      height: 80px;
      font-size: 12px;
    }
    .drag-shadow {
      width: 80px;
      height: 80px;
    }
    .tabs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, auto);
      gap: var(--spacing-3);
      border-bottom: none;
    }
    button.tab {
      border-radius: 10px;
      padding: var(--spacing-2);
      background-color: var(--bg-color-dark-transparent-3);
    }
  }
</style>
