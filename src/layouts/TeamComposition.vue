<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useCharStore } from '@/store/char'
  import { useLastTabStore } from '@/store/tab'
  import SelectChar from '@/components/modal/SelectChar.vue'
  import { getAssetsFile } from '@/utils/getAssetsFile'
  import { fetchSkillOptions } from '@/utils/fetchSkillOptions'
  import { toast } from 'vue3-toastify'
  import 'vue3-toastify/dist/index.css'
  import { fetchCommandSkill } from '@/utils/fetchCommandSkill'
  import { useDraggable } from '@vueuse/core'

  const charStore = useCharStore()
  const lastTabStore = useLastTabStore()

  const buttons = [
    { key: 1, label: 'Button 1' },
    { key: 2, label: 'Button 2' },
    { key: 3, label: 'Button 3' },
    { key: 4, label: 'Button 4' },
    { key: 5, label: 'Button 5' },
    { key: 6, label: 'Button 6' },
  ]

  const tabs = [
    { key: 1, label: 'Team 1' },
    { key: 2, label: 'Team 2' },
    { key: 3, label: 'Team 3' },
    { key: 4, label: 'Team 4' },
    { key: 5, label: 'Team 5' },
    { key: 6, label: 'Team 6' },
  ]

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
  const buttonRefs = ref({}) // 儲存按鈕 DOM 引用
  const draggables = ref({}) // 儲存 useDraggable 實例
  const draggedKey = ref(null) // 當前拖曳的按鈕鍵值
  const dragTimestamp = ref(0) // 拖曳開始的時間戳
  const mouseOnButton = ref(null) // 起始按鈕鍵值
  const mouseDownButton = ref(null) // 目標按鈕鍵值
  const isDragging = ref(false) // 控制影子元素顯示
  const shadowPosition = ref({ x: 0, y: 0 }) // 影子元素位置
  const shadowContent = ref(null) // 影子元素內容

  // 開始拖曳
  function startDrag(key) {
    const button = buttonRefs.value[key]
    if (button && draggables.value[key]) {
      const rect = button.getBoundingClientRect()
      shadowPosition.value = { x: rect.left, y: rect.top }
      shadowContent.value = charStore.selections[selectedTab.value][key]
      isDragging.value = true
      mouseOnButton.value = key
      draggedKey.value = key
      button.classList.add('dragging')
    } else {
      console.error(`Draggable for key ${key} is not properly initialized`)
    }
  }

  // 交換按鈕數據
  function swapButtons() {
    let clickedKey = null
    if (
      mouseOnButton.value === null ||
      mouseDownButton.value === null ||
      mouseOnButton.value === mouseDownButton.value
    ) {
      console.log('Swap skipped:', {
        mouseOnButton: mouseOnButton.value,
        mouseDownButton: mouseDownButton.value,
      })
      // 短時位置不變的拖曳被認為是click事件
      if (Date.now() - dragTimestamp.value < 200) clickedKey = mouseOnButton.value
    } else {
      console.log('Swapping:', {
        source: mouseOnButton.value,
        target: mouseDownButton.value,
      })
      const currentTab = selectedTab.value
      const sourceKey = mouseOnButton.value
      const targetKey = mouseDownButton.value
      const temp = { ...charStore.selections[currentTab][sourceKey] }
      charStore.selections[currentTab][sourceKey] = { ...charStore.selections[currentTab][targetKey] }
      charStore.selections[currentTab][targetKey] = temp
    }
    mouseOnButton.value = null
    mouseDownButton.value = null
    draggedKey.value = null
    isDragging.value = false
    document.body.style.overflow = ''
    if (clickedKey) handleBoxClick(clickedKey)
  }

  // 初始化 useDraggable
  onMounted(() => {
    for (const button of buttons) {
      const key = button.key
      const ref = computed(() => buttonRefs.value[key])
      if (ref.value) {
        const rect = ref.value.getBoundingClientRect()
        console.log(`Initializing draggable for key ${key} at position:`, rect)
        draggables.value[key] = useDraggable(ref, {
          initialValue: { x: rect.x, y: rect.y },
          preventDefault: true,
          stopPropagation: true,
          applyStyle: false, // 防止移動原始按鈕
          onStart: () => {
            dragTimestamp.value = Date.now()
            startDrag(key)
          },
          onMove: (position) => {
            if (!isDragging.value) return
            // 更新影子元素位置
            shadowPosition.value = { x: position.x, y: position.y }
            // 碰撞檢測
            const target = document.elementFromPoint(position.x + 60, position.y + 60)
            const button = target?.closest('.team-circle-button')
            if (button) {
              const targetKey = parseInt(button.dataset.key, 10)
              if (targetKey && targetKey !== mouseOnButton.value) {
                mouseDownButton.value = targetKey
              } else {
                mouseDownButton.value = null
              }
            } else {
              mouseDownButton.value = null
            }
          },
          onEnd: () => {
            if (buttonRefs.value[mouseOnButton.value]) {
              buttonRefs.value[mouseOnButton.value].classList.remove('dragging')
            }
            swapButtons()
          },
        })
      } else {
        console.error(`Button ref not found for key: ${key}`)
      }
    }
  })

  onUnmounted(() => {
    isDragging.value = false
    mouseOnButton.value = null
    mouseDownButton.value = null
    draggedKey.value = null
    document.body.style.overflow = ''
  })

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

  const handleTouchStart = (event, key) => {
    event.stopPropagation();
    event.preventDefault();
    startDrag(key);
  };
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
      @click="refreshData"
      class="refresh-button"
      v-tooltip="{ content: 'Refresh Skill Options', placement: 'bottom' }"
    >
      <img src="@/assets/custom-icon/update.svg" alt="refresh" :class="{ spin: isRefreshing }" />
    </button>
  </div>

  <div class="button-container">
    <button
      v-for="button in buttons"
      :key="button.key"
      :data-key="button.key"
      :ref="(el) => (buttonRefs[button.key] = el)"
      :class="{
        'team-circle-button': true,
        'selected-button': charStore.selections[selectedTab][button.key]?.img !== null,
        'add-button': charStore.selections[selectedTab][button.key]?.img === null,
      }"
      @touchstart.prevent.stop="handleTouchStart($event, button.key)"
    >
      <img
        v-if="charStore.selections[selectedTab][button.key]?.img !== null"
        class="char-img"
        :src="getAssetsFile(charStore.selections[selectedTab][button.key].img)"
        :alt="charStore.selections[selectedTab][button.key]?.style"
      />
      <img v-else class="icon-img" src="@/assets/custom-icon/add.svg" alt="Add" />
    </button>
    <!-- 影子元素 -->
    <div
      v-if="isDragging"
      class="drag-shadow"
      :style="{ left: `${shadowPosition.x}px`, top: `${shadowPosition.y}px`, position: 'fixed', zIndex: 1000 }"
    >
      <img
        v-if="shadowContent?.img !== null"
        class="char-img"
        :src="getAssetsFile(shadowContent?.img)"
        :alt="shadowContent?.style"
      />
      <img v-else class="icon-img" src="@/assets/custom-icon/add.svg" alt="Add" />
    </div>
  </div>

  <SelectChar
    v-if="activeComponent !== null"
    :buttonKey="activeComponent"
    :selectedTab="selectedTab"
    @close="closeContainer"
  />
</template>

<style scoped>
  .tabs {
    display: flex;
    gap: 0;
    border-bottom: 2px solid #ccc;
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
    background-color: rgba(78, 69, 69, 0.3);
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
    font-size: 18px;
    border-radius: 10px 10px 0 0;
  }
  button.tab.active {
    background-color: #ccc;
    color: black;
  }
  button.tab:hover {
    background-color: #a5a5a5;
    color: black;
  }
  .button-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 20px;
    justify-items: center;
    align-items: center;
    height: auto;
    padding-top: 10px;
    position: relative;
  }
  .tool-container {
    display: flex;
    height: auto;
    padding-top: 10px;
    justify-content: right;
    align-items: center;
  }
  .team-circle-button {
    border-radius: 50%;
    width: 120px;
    height: 120px;
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
    background-color: rgba(79, 74, 74, 0.5);
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
      gap: 10px;
      border-bottom: none;
    }
    button.tab {
      border-radius: 10px;
      padding: 5px;
      background-color: rgba(69, 65, 69, 0.8);
    }
  }
</style>
