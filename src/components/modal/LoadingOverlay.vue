<script setup>
  import { computed } from 'vue'
  import { HalfCircleSpinner, ScalingSquaresSpinner, CirclesToRhombusesSpinner } from 'epic-spinners'

  const props = defineProps({
    visible: {
      type: Boolean,
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'half-circle',
      validator: (value) => ['half-circle', 'scaling-squares', 'circles-to-rhombuses'].includes(value),
    },
  })

  const spinnerComponents = {
    'half-circle': HalfCircleSpinner,
    'scaling-squares': ScalingSquaresSpinner,
    'circles-to-rhombuses': CirclesToRhombusesSpinner,
  }

  const selectedSpinner = computed(() => spinnerComponents[props.type])
</script>

<template>
  <div v-if="visible" class="overlay">
    <div class="spinner-container">
      <component :is="selectedSpinner" :animation-duration="2000" :size="100" color="#ff1d5e" />
      <p v-if="text" class="loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .loading-text {
    color: rgb(221, 174, 174);
    margin-top: 20px;
    font-size: 1.2em;
    font-weight: bold;
  }
</style>
