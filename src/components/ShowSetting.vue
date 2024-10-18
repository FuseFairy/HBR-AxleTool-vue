<script setup>
import { useSettingStore } from '@/stores/setting_stores';
import { useSliderStore } from '@/stores/slider_stores';
import Multiselect from '@vueform/multiselect'

const settingStore = useSettingStore()
const sliderStore = useSliderStore()

const langOptions = [
  {value: 'zh-TW', name: '繁體中文'},
  {value: 'en', name: 'English'}
]

const emit = defineEmits(['close'])
const closeTable = () => {
  emit('close')
}
</script>

<template>
  <div @click="closeTable" class="overlay">
    <div @click.stop class="container">
      <div class="button-group">
          <button @click="closeTable" class="close">
            <img src="@/assets/custom_icon/close.svg" alt="Close" />
          </button>
      </div>
      <div class="table">
        <div class="option">
          <label class="large-bold-label">Language</label>
          <Multiselect
            v-model="settingStore.lang"
            label="name"
            :options="langOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css" />
<style scoped>
.large-bold-label {
  font-size: 1.2em;
  font-weight: bold;
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
  width: 400px;
  box-sizing: border-box;
  padding: 1rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
}
.button-group {
  display: flex;
  justify-content: right;
  align-items: center;
}
.option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-top: 1rem;
  gap: 60px;
}
.close {
  background-color: transparent;
  padding: 1px;
  border: none;
  box-sizing: border-box;
  height: 32px;
  width: 32px;
  cursor: pointer;
}
.close img {
  height: 100%;
  width: 100%;
}
.table {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 0 1rem 0 0;
}
.scrollbar-style-1 {
  overflow-x: auto;
}
.scrollbar-style-1::-webkit-scrollbar {
  width: 5px;
  height: 0;
}
.scrollbar-style-1::-webkit-scrollbar-track,
.scrollbar-style-1::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.scrollbar-style-1::-webkit-scrollbar-thumb {
  background-color: #555;
}
:deep(.multiselect-option) {
  display: flex;
  gap: 0.5rem;
}
:deep(.multiselect) {
  background-color: black;
  border: 1px solid rgb(64, 68, 141);
  margin-top: 2px;
}
:deep(.multiselect.is-active) {
  box-shadow: none;
}
:deep(.multiselect-dropdown) {
  background-color: black;
  border: 1px solid rgb(64, 68, 141);
}
:deep(.multiselect-dropdown::-webkit-scrollbar) {
  width: 5px;
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
@media (max-width: 800px) {
  .container {
    width: 100%;
  }
}
</style>