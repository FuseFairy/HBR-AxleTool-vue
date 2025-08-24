<template>
  <div class="slider-container">
    <div class="top-container">
      <p>Number Of Rows：{{ sliderStore.rows }}</p>
    </div>
    <vue-slider
      v-model="sliderStore.rows"
      :disabled="!hasChar"
      :min="0"
      :max="80"
      :interval="1"
      :contained="true"
      :lazy="true"
      :drag-on-click="true"
      :marks="[0, 80]"
      @change="updateSkillsRows"
    />
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useSliderStore } from '@/store/slider'
  import { useSkillStore } from '@/store/axle'
  import { useCharStore } from '@/store/char'
  import VueSlider from 'vue-slider-component'
  import '@/style/slider/slider.css'

  const sliderStore = useSliderStore()
  const skillStore = useSkillStore()
  const charStore = useCharStore()

  const updateSkillsRows = (value) => {
    skillStore.adjustSkills(value)
  }

  const hasChar = computed(() => {
    return Object.values(charStore.selections).some((team) =>
      Object.values(team).some((selection) => selection.character !== null && selection.style !== null)
    )
  })
</script>

<style scoped>
  .top-container {
    margin-bottom: 5px;
    display: flex;
    color: var(--primary-light-color);
    font-family: var(--font-family-serif);
  }

  .input-container:hover {
    border: 1px solid var(--danger-color);
    transition: 0.3s ease;
  }

  .input-container:hover input,
  .input-container:hover button {
    border: none;
  }

  .slider-container {
    width: 100%;
    padding-bottom: 20px;
    background-color: transparent;
    box-sizing: border-box;
  }

  .icon {
    height: 12px;
  }

  .disabled-icon {
    opacity: 0.5;
  }

  h3 {
    margin-bottom: 1vh;
    color: #e8eaed;
  }

  input {
    background-color: #262730;
    color: #ffffff;
    text-align: center;
    height: 100%;
    width: 70px;
    margin: none;
    border: none;
  }

  button {
    background-color: #262730;
    height: 100%;
    width: 32px;
    color: white;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--danger-color);
  }

  .disabled-button {
    cursor: not-allowed;
  }

  button:disabled:hover {
    background-color: #262730;
  }
</style>
