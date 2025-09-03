import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore(
  'ui',
  () => {
    // From scrollbar.js
    const scrollbarTopOffset = ref(0)
    const scrollbarInstance = ref(null)

    // From showRow.js
    const showTag = ref(['rank', 'earring', 'passive skill', 'skill', 'axle', 'spiritual'])
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
    },
  },
)
