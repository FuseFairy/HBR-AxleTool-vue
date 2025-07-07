<script setup>
  import { useSkillStore } from '@/store/axle'

  const skillStore = useSkillStore()
  const maxlength = 35
</script>

<template>
  <p class="form-label">Axle Name</p>
  <input
    v-model="skillStore.axleName"
    type="text"
    placeholder="Enter your axle name"
    class="form-input"
    :maxlength="maxlength"
  />
  <p class="char-counter">{{ skillStore.axleName.length }} / {{ maxlength }}</p>
</template>

<style scoped>
  .form-label {
    font-family: var(--font-family-serif);
    color: var(--primary-light-color);
  }
  .form-input {
    background-color: rgba(151, 107, 135, 0.5);
    color: white;
    border: none;
    padding: var(--spacing-2);
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
  }
  .form-input:focus {
    outline: none;
  }
  .char-counter {
    color: gray;
    font-size: 0.8rem;
    text-align: right;
    margin-top: 0;
  }
</style>
