<template>
  <div class="flex items-center justify-center h-auto">
    <button
      class="add-button"
      :disabled="sliderStore.rows === 80 || (sliderStore.rows === 0 && !hasChar)"
      @click="addRow"
    >
      <img class="icon-img" src="@/assets/custom-icon/add_circle.svg" alt="Add a row" />
    </button>
  </div>
</template>

<script setup>
  import { computed, nextTick } from 'vue'
  import { useSliderStore } from '@/store/slider'
  import { useSkillStore } from '@/store/axle'
  import { useCharStore } from '@/store/char'

  const sliderStore = useSliderStore()
  const skillStore = useSkillStore()
  const charStore = useCharStore()

  const addRow = () => {
    if (sliderStore.rows < 80) {
      sliderStore.rows++
      skillStore.adjustSkills(sliderStore.rows)
      nextTick(async () => {
        await nextTick()
        scrollToBottom()
      })
    }
  }

  const hasChar = computed(() => {
    return Object.values(charStore.selections).some((group) =>
      Object.values(group).some((selection) => selection.character !== null && selection.style !== null)
    )
  })

  const scrollToBottom = () => {
    const mainElement = document.querySelector('main.scrollbar-style-1')
    if (mainElement) {
      mainElement.scrollTo({
        top: mainElement.scrollHeight,
        behavior: 'smooth',
      })
    }
  }
</script>

<style scoped>
  .add-button {
    margin-top: var(--spacing-5);
    width: 80px;
    height: 80px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
  }
  .add-button:hover .icon-img {
    filter: brightness(1.5);
    transform: scale(1.1);
    transition: 0.3s ease;
  }
  .icon-img {
    transition: 0.3s ease;
    transform-origin: center;
    width: 80px;
    height: 80px;
  }
  button:disabled {
    display: none;
  }
  @media (max-width: 800px) {
    .add-button {
      width: 60px;
      height: 60px;
      font-size: 14px;
    }
  }
</style>
