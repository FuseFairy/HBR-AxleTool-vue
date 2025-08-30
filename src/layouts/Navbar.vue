<script setup>
  import { ref, computed } from 'vue'
  import { getAssetsFile } from '@/utils/assets/getAssetsFile'
  import UploadButton from '@/components/ui/UploadButton.vue'
  import Axle from '@/components/modal/Axle.vue'
  import Settings from '@/components/modal/Settings.vue'
  import { useSidebarStore } from '@/store/sidebar'
  import { storeToRefs } from 'pinia'

  const sidebarStore = useSidebarStore()
  const { isSidebarOpen } = storeToRefs(sidebarStore)

  const sidebarIcon = computed(() => {
    return isSidebarOpen.value
      ? getAssetsFile('custom-icon/panel_close.svg')
      : getAssetsFile('custom-icon/panel_open.svg')
  })

  const buttons = [
    { key: 'table', tooltip: 'table', icon: getAssetsFile('custom-icon/table.svg'), component: Axle },
    { key: 'docs', tooltip: 'docs', icon: getAssetsFile('custom-icon/docs.svg') },
    {
      key: 'setting',
      tooltip: 'setting',
      icon: getAssetsFile('custom-icon/setting.svg'),
      component: Settings,
    },
    { key: 'bug_report', tooltip: 'report bug', icon: getAssetsFile('custom-icon/bug_report.svg') },
  ]
  const docsURL = 'https://github.com/FuseFairy/HBR-AxleTool-vue/blob/main/README.md'
  const bugReportURL = 'https://github.com/FuseFairy/HBR-AxleTool-vue/issues'
  const activeModal = ref(null)

  const activeComponent = computed(() => {
    const btn = buttons.find((b) => b.key === activeModal.value)
    return btn ? btn.component : null
  })

  const toggleModal = (key) => {
    activeModal.value = activeModal.value === key ? null : key
  }

  const handleButtonClick = (key) => {
    if (key === 'docs') {
      window.open(docsURL, '_blank')
    } else if (key === 'bug_report') {
      window.open(bugReportURL, '_blank')
    } else {
      toggleModal(key)
    }
  }

  const toggleSidebar = () => {
    sidebarStore.toggleSidebar()
  }
</script>

<template>
  <nav>
    <div class="left-button-group">
      <button v-tooltip="{ content: 'Sidebar', placement: 'bottom' }" @click="toggleSidebar">
        <img :src="sidebarIcon" alt="Toggle Sidebar" />
      </button>
      <UploadButton />
    </div>
    <h1 class="nav-title">HBR Axle Tool</h1>
    <div class="right-button-group">
      <button
        v-for="btn in buttons"
        :key="btn.key"
        v-tooltip="{ content: btn.tooltip, placement: 'bottom' }"
        :class="{ 'setting-icon-button': btn.key === 'setting', 'github-icon-button': btn.key === 'github' }"
        @click="handleButtonClick(btn.key)"
      >
        <img :src="btn.icon" :alt="btn.key" />
      </button>
    </div>
  </nav>
  <component :is="activeComponent" v-if="activeComponent" @close="toggleModal(null)" />
</template>

<style scoped>
  nav {
    display: flex;
    align-items: center;
    z-index: 1001;
    height: 3rem;
    width: 100%;
    padding: var(--spacing-4);
    box-sizing: border-box;
    position: fixed;
    grid-area: navbar;
    background-color: var(--bg-color-dark-2);
    color: white;
  }
  .nav-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-family: var(--font-family-serif);
    color: var(--text-color-light-purple-2);
  }
  .left-button-group {
    display: flex;
    gap: var(--spacing-3);
    margin-right: auto;
  }
  .right-button-group {
    display: flex;
    gap: var(--spacing-3);
    margin-left: auto;
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
  .github-icon-button img {
    filter: invert(1);
    width: 24px;
    height: 24px;
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
    background-color: var(--bg-color-light-gray-transparent);
  }
  @media (max-width: 800px) {
    .nav-title {
      display: none;
    }
  }
</style>
