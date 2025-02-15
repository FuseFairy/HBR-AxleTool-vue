<script setup>
import { ref, computed } from 'vue'
import { getAssetsFile } from '@/scripts/util'
import { useSettingStore } from '@/stores/setting_stores'
import Multiselect from '@vueform/multiselect'

const langOptions = [
  { "value": "zh-TW", "name": "繁體中文" },
  { "value": "jp", "name": "日本語" },
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
        <img src="@/assets/custom_icon/close.svg" alt="Close" />
      </button>
      <div class="section" style="padding-top: 15px;">
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
.section {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  gap: 3rem;
  width: 100%;
}
label {
  font-family: 'Gugi', 'Noto Sans TC', sans-serif;
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
.multiselect-single-label {
  display: flex;
  gap: 0.5rem;
}
:deep(.multiselect-tags-search) {
  background-color: black;
  color: white;
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
  width: 0;
}
:deep(.multiselect-dropdown::-webkit-scrollbar-track),
:deep(.multiselect-dropdown::-webkit-scrollbar-thumb) {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
:deep(.multiselect-dropdown::-webkit-scrollbar-thumb) {
  background-color: #555;
}
:deep(.multiselect-option.is-selected) {
  background-color: rgb(60, 57, 57);
}
:deep(.multiselect-option.is-pointed) {
  background-color: rgb(160, 160, 167);
  color: rgb(0, 0, 0);
}
:deep(.multiselect-caret) {
  margin-left: 14px;
}
:deep(.multiselect-clear) {
  padding: 0;
}
:deep(.multiselect-clear-icon:hover),
:deep(.multiselect-clear-icon:active),
:deep(.multiselect-clear-icon:focus) {
  background-color: #999;
}
:deep(.multiselect-clear-icon) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100%;
  font-size: 0;
}
:deep(.multiselect-tag) {
  background-color: #663fba;
}
@media (max-width: 950px) {
  .container {
    width: 100%;
  }
}
</style>