<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useCharStore } from '@/store/char'
  import { useSkillStore } from '@/store/axle'
  import { useLastTabStore } from '@/store/tab'
  import { getAssetsFile } from '@/utils/getAssetsFile'

  const charStore = useCharStore()
  const skillStore = useSkillStore()
  const lastTabStore = useLastTabStore()

  const isVisible = ref(false)
  onMounted(() => {
    isVisible.value = true
  })

  const props = defineProps({
    row: {
      type: Number,
      required: true,
    },
    buttonKey: {
      type: Number,
      required: true,
    },
  })

  const tabs = [
    { key: 1, label: 'Team 1' },
    { key: 2, label: 'Team 2' },
    { key: 3, label: 'Team 3' },
    { key: 4, label: 'Team 4' },
    { key: 5, label: 'Team 5' },
    { key: 6, label: 'Team 6' },
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
      Object.entries(charStore.selections[selectedTab.value]).filter(([, value]) => value.img !== null)
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
    isVisible.value = false
    setTimeout(() => {
      emit('close')
    }, 300)
  }
</script>

<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="isVisible" class="overlay flex justify-center items-center" @click="closeContainer">
        <div class="container" @click.stop>
          <button class="close flex justify-center items-center" @click="closeContainer">
            <img src="@/assets/custom-icon/close.svg" alt="Close" />
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
    </transition>
  </teleport>
</template>

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
  .tabs {
    display: flex;
    gap: 0;
    border-bottom: 2px solid var(--border-color-light-gray);
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
  .container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--bg-color-dark);
    height: auto;
    width: auto;
    padding: var(--spacing-6);
    padding-right: 3rem;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 3px solid #262426;
    box-sizing: border-box;
  }
  .close {
    background-color: transparent;
    padding: 1px;
    border: none;
    box-sizing: border-box;
    height: 32px;
    width: 32px;
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
    background-color: var(--bg-color-black-transparent);
    z-index: 1100;
    backdrop-filter: blur(5px);
  }
  .button-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-4);
    margin-top: var(--spacing-4);
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
    background-color: var(--bg-color-dark-transparent-2);
    position: relative;
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
  .overlay-text {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color-black-transparent);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    pointer-events: none;
    font-family: var(--font-family-xiaolai);
  }
</style>
