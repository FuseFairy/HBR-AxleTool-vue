<script setup>
  import { useSettingStore } from '@/store/setting'
  import Multiselect from '@vueform/multiselect'

  const langOptions = [
    { value: 'zh-TW', name: '繁體中文' },
    { value: 'jp', name: '日本語' },
    { value: 'zh-CN', name: '简体中文' },
  ]
  const settingStore = useSettingStore()

  const emit = defineEmits(['close'])
  const closeContainer = () => {
    emit('close')
  }
</script>

<template>
  <div @click="closeContainer" class="overlay">
    <div @click.stop class="container">
      <button @click="closeContainer" class="close">
        <img src="@/assets/custom-icon/close.svg" alt="Close" />
      </button>
      <div class="section" style="padding-top: 15px">
        <label>Language</label>
        <Multiselect
          v-model="settingStore.lang"
          placeholder="Language"
          label="name"
          track-by="value"
          :options="langOptions"
          :canClear="false"
          :canDeselect="false"
        />
      </div>
    </div>
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css" />
<style scoped>
  label {
    color: rgb(209, 228, 222);
    font-family: 'Gugi', 'Noto Sans TC', sans-serif;
  }
  .section {
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    gap: 3rem;
    width: 100%;
  }
  .close {
    background-color: transparent;
    padding: 1px;
    border: none;
    box-sizing: border-box;
    height: 32px;
    width: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
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
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 1100;
    backdrop-filter: blur(5px);
  }
  .container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(19, 18, 18);
    height: auto;
    width: 450px;
    box-sizing: border-box;
    padding: 1.5rem;
    padding-right: 3rem;
    border-radius: 20px;
    display: flex;
    align-items: center;
  }
  :deep(.multiselect-option),
  :deep(.multiselect-single-label-text) {
    color: #fff;
  }
  :deep(.multiselect) {
    background-color: black;
    border: 2px solid rgb(178, 180, 222);
    margin-top: 2px;
    width: 100%;
  }
  :deep(.multiselect.is-active) {
    box-shadow: none;
  }
  :deep(.multiselect-dropdown) {
    background-color: black;
    border: 2px solid rgb(178, 180, 222);
    max-height: 15rem;
  }
  :deep(.multiselect-dropdown::-webkit-scrollbar) {
    display: none;
  }
  :deep(.multiselect-option.is-selected) {
    background-color: rgb(60, 57, 57);
  }
  :deep(.multiselect-option.is-pointed) {
    background-color: rgb(160, 160, 167);
    color: rgb(0, 0, 0);
  }
  @media (max-width: 800px) {
    .container {
      width: 100%;
    }
  }
</style>
