import { defineStore } from 'pinia'
import { ref } from 'vue'

const VERSION = '1.0.0' // Initial version for ui store

// Define old store keys for migration
const OLD_STORE_KEYS = ['scrollbar', 'showRow', 'showTeam', 'sidebar', 'slider', 'lastTab']

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
      serializer: {
        serialize: (state) => {
          return JSON.stringify({ data: state, version: VERSION })
        },
        deserialize: (jsonString) => {
          if (!jsonString) {
            // Attempt to migrate from old stores if new store data is not found
            console.info('[UI Store] No existing UI store data found. Attempting migration from old stores.')
            const migratedState = {
              scrollbarTopOffset: 0,
              scrollbarInstance: null,
              showTag: ['rank', 'earring', 'passive skill', 'skill', 'axle', 'spiritual'],
              showTeam: [],
              isSidebarOpen: window.innerWidth >= 800 ? true : false,
              sliderRows: 0,
              axleLastTab: 1,
              boxLastTab: 1,
            }

            OLD_STORE_KEYS.forEach((key) => {
              const oldData = localStorage.getItem(key)
              if (oldData) {
                try {
                  const parsedData = JSON.parse(oldData)
                  switch (key) {
                    case 'scrollbar':
                      if (parsedData.topOffset !== undefined) migratedState.scrollbarTopOffset = parsedData.topOffset
                      // instance is not persisted
                      break
                    case 'showTag':
                      if (parsedData.showRow !== undefined) migratedState.showTag = parsedData.showRow
                      break
                    case 'showTeam':
                      if (parsedData.showTeam !== undefined) migratedState.showTeam = parsedData.showTeam
                      break
                    case 'sidebar':
                      if (parsedData.isSidebarOpen !== undefined) migratedState.isSidebarOpen = parsedData.isSidebarOpen
                      break
                    case 'slider':
                      if (parsedData.rows !== undefined) migratedState.sliderRows = parsedData.rows
                      break
                    case 'lastTab':
                      if (parsedData.axle_lastTab !== undefined) migratedState.axleLastTab = parsedData.axle_lastTab
                      if (parsedData.box_lastTab !== undefined) migratedState.boxLastTab = parsedData.box_lastTab
                      break
                  }
                  console.info(`[UI Store] Migrated data from old store: ${key}`)
                  localStorage.removeItem(key) // Clear old store data after migration
                } catch (e) {
                  console.error(`[UI Store] Error parsing old store data for ${key}:`, e)
                }
              }
            })
            return migratedState
          }

          const storedState = JSON.parse(jsonString)

          // Handle migration if needed for future versions of ui store
          if (storedState.version === VERSION) {
            return storedState.data
          } else {
            console.warn(
              `[UI Store] Data version mismatch. Stored: ${storedState.version}, Current: ${VERSION}. Resetting store.`,
            )
            return {}
          }
        },
      },
    },
  },
)
