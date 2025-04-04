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
      @click="handleBoxClick(button.key)"
      :class="{
        'circle-button selected-button': charStore.selections[selectedTab][button.key].img !== null,
        'circle-button add-button': charStore.selections[selectedTab][button.key].img === null,
      }"
    >
      <img
        v-if="charStore.selections[selectedTab][button.key].img !== null"
        class="char-img"
        :src="getAssetsFile(charStore.selections[selectedTab][button.key].img)"
        :alt="charStore.selections[selectedTab][button.key].style"
      />
      <img v-else class="icon-img" src="@/assets/custom-icon/add.svg" alt="Add" />
    </button>
  </div>
  <Transition name="modal">
    <SelectChar
      v-if="activeComponent !== null"
      :buttonKey="activeComponent"
      :selectedTab="selectedTab"
      @close="closeContainer"
    />
  </Transition>
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
  .button-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 20px;
    justify-items: center;
    align-items: center;
    height: auto;
    padding-top: 10px;
  }
  .tool-container {
    display: flex;
    height: auto;
    padding-top: 10px;
    justify-content: right;
    align-items: center;
  }
  .circle-button {
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
    .circle-button {
      width: 80px;
      height: 80px;
      font-size: 12px;
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
      background-color: rgba(69, 65, 69, 0.8);
    }
  }
</style>
