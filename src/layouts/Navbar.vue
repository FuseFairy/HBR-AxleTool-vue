<script setup>
  import { ref, computed } from 'vue'
  import { getAssetsFile } from '@/utils/getAssetsFile'
  import UploadButton from '@/components/ui/UploadButton.vue'
  import Axle from '@/components/modal/Axle.vue'
  import Settings from '@/components/modal/Settings.vue'

  const buttons = [
    { key: 'table', tooltip: 'table', icon: getAssetsFile('custom-icon/table.svg'), component: Axle },
    {
      key: 'setting',
      tooltip: 'setting',
      icon: getAssetsFile('custom-icon/setting.svg'),
      component: Settings,
    },
    { key: 'bug_report', tooltip: 'bug report', icon: getAssetsFile('custom-icon/bug_report.svg') },
  ]
  const bugReportURL = 'https://github.com/FuseFairy/HBR-AxleTool-vue/issues/new'
  const activeModal = ref(null)

  const activeComponent = computed(() => {
    const btn = buttons.find((b) => b.key === activeModal.value)
    return btn ? btn.component : null
  })

  const toggleModal = (key) => {
    activeModal.value = activeModal.value === key ? null : key
  }

  const handleButtonClick = (key) => {
    if (key === 'table' || key === 'setting') {
      toggleModal(key)
    } else if (key === 'bug_report') {
      window.open(bugReportURL, '_blank')
    }
  }
</script>

<template>
  <nav>
    <UploadButton />
    <h1 class="nav-title">HBR Axle Tool</h1>
    <div class="right-button-group">
      <button
        v-for="btn in buttons"
        :key="btn.key"
        @click="handleButtonClick(btn.key)"
        v-tooltip="{ content: btn.tooltip, placement: 'bottom' }"
        :class="{ 'setting-icon-button': btn.key === 'setting' }"
      >
        <img :src="btn.icon" :alt="btn.key" />
      </button>
    </div>
  </nav>
  <Transition name="modal">
    <component :is="activeComponent" v-if="activeComponent" @close="toggleModal(null)" />
  </Transition>
</template>

<style scoped>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1001;
    height: 3rem;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
    position: fixed;
    grid-area: navbar;
    background-color: rgb(21, 21, 23);
    color: white;
  }
  .nav-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-family: 'Gugi', 'Noto Sans TC', sans-serif;
    color: rgb(210, 203, 208);
  }
  .right-button-group {
    display: flex;
    gap: 10px;
  }
  .setting-icon-button {
    transition: transform 0.5s ease-in-out;
  }
  .setting-icon-button img {
    transition: transform 0.5s ease-in-out;
  }
  .setting-icon-button:hover img {
    transform: rotate(45deg);
  }
  .modal-enter-active,
  .modal-leave-active {
    transition: all 0.3s ease;
  }
  .modal-enter-from {
    transform: scale(0.8);
    opacity: 0;
  }
  .modal-leave-to {
    transform: scale(0.8);
    opacity: 0;
  }
  button {
    background-color: transparent;
    padding: 1px;
    border: none;
    box-sizing: border-box;
    height: 32px;
    width: 32px;
    cursor: pointer;
    border-radius: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  button:hover {
    background-color: rgba(78, 69, 69, 0.3);
  }
  @media (max-width: 800px) {
    .nav-title {
      display: none;
    }
  }
</style>
