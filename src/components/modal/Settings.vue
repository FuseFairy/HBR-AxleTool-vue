<script setup>
  import { useSettingStore } from '@/store/setting'
  import { ref, onMounted } from 'vue'
  import Multiselect from '@vueform/multiselect'

  const langOptions = [
    { value: 'zh-TW', name: '繁體中文' },
    { value: 'jp', name: '日本語' },
    { value: 'zh-CN', name: '简体中文（国际服）' },
    { value: 'zh-CN-CN', name: '简体中文（B服）' },
  ]
  const settingStore = useSettingStore()

  const isVisible = ref(false)
  onMounted(() => {
    isVisible.value = true
  })

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
      <div v-if="isVisible" class="overlay" @click="closeContainer">
        <div class="container" @click.stop>
          <button class="close" @click="closeContainer">
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
              :can-clear="false"
              :can-deselect="false"
            />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style src="@vueform/multiselect/themes/default.css" />
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
  label {
    color: var(--text-color-light-green-2);
    font-family: var(--font-family-serif);
  }
  .section {
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-6);
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
    background-color: var(--bg-color-black-transparent);
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
    border: 3px solid rgb(31, 44, 52);
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
