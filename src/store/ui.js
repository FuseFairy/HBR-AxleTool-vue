import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore(
  'ui',
  () => {
    // From scrollbar.js
    const scrollbarTopOffset = ref(0)
    const scrollbarInstance = ref(null)

    // From showRow.js
    const showTag = ref(['rank', 'earring', 'passive skill', 'skill', 'axle', 'spiritual', 'reincarnation', 'resonance'])
    // Bumped when a new tag is added, so saved settings get the new tag switched on once
    const showTagVersion = ref(0)
    function setShowTag(row_list) {
      showTag.value = row_list
    }

    // From showTeam.js
    const showTeam = ref([])
    function setShowTeam(row_list) {
      showTeam.value = row_list
    }

    // From sidebar.js
    const isSidebarOpen = ref(window.innerWidth >= 800 ? true : false)
    function toggleSidebar() {
      isSidebarOpen.value = !isSidebarOpen.value
    }

    // From slider.js
    const sliderRows = ref(0)

    // From tab.js
    const axleLastTab = ref(1)
    const boxLastTab = ref(1)

    return {
      // Scrollbar
      scrollbarTopOffset,
      scrollbarInstance,

      // Show Tag
      showTag,
      setShowTag,
      showTagVersion,

      // Show Team
      showTeam,
      setShowTeam,

      // Sidebar
      isSidebarOpen,
      toggleSidebar,

      // Slider
      sliderRows,

      // Tab
      axleLastTab,
      boxLastTab,
    }
  },
  {
    persist: {
      storage: localStorage,
      afterHydrate: ({ store }) => {
        const version = store.showTagVersion || 0
        if (version < 1 && !store.showTag.includes('reincarnation')) store.showTag.push('reincarnation')
        if (version < 2 && !store.showTag.includes('resonance')) store.showTag.push('resonance')
        store.showTagVersion = 2
      },
    },
  },
)
