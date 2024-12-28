<template>
  <div class="container">
    <button
      @click="addRow"
      class="circle-button add-button"
      :disabled="sliderStore.rows === 50 || (sliderStore.rows === 0 && !hasChar)"
    >
      <img class="icon-img" src="@/assets/custom_icon/add_circle.svg" alt="Add a row" />
    </button>
  </div>
</template>

<script setup>
import { computed, nextTick } from 'vue'
import { useSliderStore } from '@/stores/slider_stores'
import { useSkillStore } from '@/stores/skill_stores'
import { useCharStore } from '@/stores/char_stores'

const sliderStore = useSliderStore()
const skillStore = useSkillStore()
const charStore = useCharStore()

const addRow = () => {
  if (sliderStore.rows < 50) {
    sliderStore.rows++
    skillStore.adjustSkills(sliderStore.rows)
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const hasChar = computed(() => {
  return Object.values(charStore.selections).some((group) =>
    Object.values(group).some(
      (selection) => selection.character !== null && selection.style !== null
    )
  )
})

const scrollToBottom = () => {
  const mainElement = document.querySelector('main.scrollbar-style-1')
  if (mainElement) {
    mainElement.scrollTo({
      top: mainElement.scrollHeight,
      behavior: 'smooth'
    })
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
}
.circle-button {
  margin-top: 20px;
  width: 80px;
  height: 80px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}
.add-button {
  border: none;
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
  .container {
    width: auto;
  }
  .circle-button {
    width: 60px;
    height: 60px;
    font-size: 14px;
  }
}
</style>
