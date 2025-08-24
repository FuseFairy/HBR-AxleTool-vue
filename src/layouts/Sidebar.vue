<script setup>
  import { useSidebarStore } from '@/store/sidebar'
  import { useSkillStore } from '@/store/axle'
  import { useSliderStore } from '@/store/slider'
  import { useAxleCollectionStore } from '@/store/axleCollection'
  import { storeToRefs } from 'pinia'
  import { ref, computed } from 'vue'
  import { getAssetsFile } from '@/utils/getAssetsFile'
  import { decompressAxleData } from '@/utils/decompressAxleData'
  import { compressToBase64, decompressFromBase64 } from 'lz-string'


  const sidebarStore = useSidebarStore()
  const skillStore = useSkillStore()
  const axleCollectionStore = useAxleCollectionStore()
  const sliderStore = useSliderStore()
  const { isSidebarOpen } = storeToRefs(sidebarStore)
  const { axles, sortOrder } = storeToRefs(axleCollectionStore)

  const searchQuery = ref('')
  const editingAxle = ref(null)
  const newAxleName = ref('')
  const isAnyButtonHovered = ref(false)
  const maxlength = 35

  const filteredAxles = computed(() => {
    let result = axles.value
    
    // 搜索過濾
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter((axle) => axle.name.toLowerCase().includes(query))
    }
    
    // 排序
    result = [...result].sort((a, b) => {
      return sortOrder.value === 'asc'
        ? a.time.localeCompare(b.time)  // 升序
        : b.time.localeCompare(a.time)  // 降序
    })

    return result
  })

  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    axles.value = [...axles.value].sort((a, b) => {
      return sortOrder.value === 'asc'
        ? a.time.localeCompare(b.time)  // 升序
        : b.time.localeCompare(a.time)  // 降序
    })
  }

  const editAxleName = (axle) => {
    editingAxle.value = axle
    newAxleName.value = axle.name
  }

  const saveEdit = (axle) => {
    if (newAxleName.value.trim() !== '') {
      const oldAxleName = axle.name
      axle.name = newAxleName.value.trim()

      if (newAxleName.value !== oldAxleName) {
        // If the edited axle is the currently loaded one, update skillStore.axleName
        if (axle.id === skillStore.axleId) {
          skillStore.axleName = axle.name
        }
        // Update axle.data with the new name
        const decodedData = JSON.parse(decompressFromBase64(axle.data))
        decodedData.axleName = axle.name
        axle.data = compressToBase64(JSON.stringify(decodedData))
      }
      editingAxle.value = null
      newAxleName.value = ''
    }
  }

  const cancelEdit = () => {
    editingAxle.value = null
    newAxleName.value = ''
  }

  const deleteAxle = (axleToDelete) => {
    axleCollectionStore.axles = axleCollectionStore.axles.filter(
      (axle) => axle.id !== axleToDelete.id
    )

    if (axleToDelete.id === skillStore.axleId) {
      skillStore.axleId = ''
    }
  }

  const loadAxle = async (axle) => {
    if (axle.id === skillStore.axleId) {
      sliderStore.rows = 0
      skillStore.axleId = ''
      skillStore.adjustSkills(0)
      skillStore.axleName = ''
    } else {
      await decompressAxleData(axle.data)
      skillStore.axleId = axle.id
    }
  }
</script>

<template>
  <aside :class="{ 'sidebar-open': isSidebarOpen }">
    <div class="sidebar-content">
      <div class="sidebar-header">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Axle Name"
          class="search-input"
        />
        <button class="sort-button" @click="toggleSortOrder">
          Sort by Time {{ sortOrder === 'asc' ? '(Oldest)' : '(Newest)' }}
        </button>
      </div>

      <div class="axle-cards-container custom-scrollbar">
        <div v-if="filteredAxles.length === 0" class="no-axles-message">
          No axles found.
        </div>
        <TransitionGroup name="list-transition">
          <div v-for="axle in filteredAxles" :key="axle.id" :title="axle.name" class="axle-card" :class="{ 'card-hover-effect': !isAnyButtonHovered, 'selected-axle-card': axle.id === skillStore.axleId }" @click="loadAxle(axle)">
            <div class="card-header">
              <template v-if="editingAxle === axle">
                <div class="edit-mode-controls">
                  <div class="input-wrapper-relative">
                    <input
                      v-model="newAxleName"
                      type="text"
                      class="edit-axle-input"
                      :maxlength="maxlength"
                      @click.stop
                      @keyup.enter="saveEdit(axle)"
                      @keyup.esc="cancelEdit()"
                    />
                    <span class="char-counter">{{ newAxleName.length }}/{{ maxlength }}</span>
                  </div>
                  <button class="check-button" @click.stop="saveEdit(axle)" @mouseenter="isAnyButtonHovered = true" @mouseleave="isAnyButtonHovered = false">
                    <img :src="getAssetsFile('custom-icon/check.svg')" alt="Check" />
                  </button>
                </div>
              </template>
              <template v-else>
                <span class="axle-name">{{ axle.name }}</span>
                <button v-tooltip="{ content: 'Edit name', placement: 'top' }" class="edit-button" @click.stop="editAxleName(axle)" @mouseenter="isAnyButtonHovered = true" @mouseleave="isAnyButtonHovered = false">
                  <img :src="getAssetsFile('custom-icon/edit.svg')" alt="Edit" />
                </button>
                <button v-tooltip="{ content: 'Remove', placement: 'top' }" class="delete-button" @click.stop="deleteAxle(axle)" @mouseenter="isAnyButtonHovered = true" @mouseleave="isAnyButtonHovered = false">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M154-412v-136h652v136H154Z"/></svg>
                </button>
              </template>
            </div>
            <div class="card-footer">
              <span class="axle-time">{{ axle.time }}</span>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </aside>
</template>

<style scoped>
  aside {
    grid-area: sidebar;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    width: max(20%, 250px);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    position: fixed; 
    height: calc(100vh - 3rem);
    top: 3rem;
    left: 0;
    z-index: 1000;
    transform: translateX(-100%);
  }

  aside::before {
    content: '';
    position: absolute;
    inset: 0;
    backdrop-filter: blur(1px);
    z-index: -1;
    border-radius: inherit;
  }

  .sidebar-open {
    transform: translateX(0); /* Open width */
    box-shadow: 10px 0 30px 5px rgba(64, 62, 62, 0.5); /* Softer, more gradient-like blue glow */
  }

  .sidebar-content {
    padding: 0.6rem;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .sidebar-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 1rem;
    padding: 0 5px;
  }

  .search-input,
  .sort-button {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .sort-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .axle-cards-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 5px;
  }

  .axle-card {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    position: relative;
    cursor: pointer;
    transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
    border: 2px solid transparent; /* Add a transparent border by default */
  }

  .axle-card.card-hover-effect:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
  }

  .selected-axle-card {
    border-color: var(--primary-light-color); /* Only change border-color */
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 5px; /* Add gap for spacing */
    margin-bottom: 5px;
    min-width: 0;
  }

  .axle-name {
    font-weight: bold;
    color: rgb(195, 157, 230);
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .edit-button,
  .check-button,
  .delete-button {
    background: none;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    padding: var(--spacing-1);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0; /* Prevent buttons from shrinking */
    transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out, border 0.2s ease-in-out;
  }

  .edit-button:hover,
  .check-button:hover,
  .delete-button:hover {
    background-color: var(--bg-color-light-gray-transparent);
    transform: scale(1.1);
  }

  .delete-button:hover svg {
    fill: rgb(239, 67, 58);
  }

  .edit-axle-input {
    flex-grow: 1;
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    min-width: 0; /* Allow input to shrink */
    padding-right: 42px; /* Make space for the counter */
  }

  .input-wrapper-relative {
    position: relative;
    flex-grow: 1;
    display: flex;
    min-width: 0;
  }

  .edit-mode-controls {
    display: flex;
    align-items: center;
    flex-grow: 1;
    min-width: 0; /* Allow the container to shrink */
    gap: 5px;
  }

  .card-footer {
    text-align: right;
    font-size: 0.8em;
    color: #ccc;
  }

  .char-counter {
    position: absolute;
    right: 8px;
    bottom: 8px;
    font-size: 0.75em;
    color: #999;
    pointer-events: none;
  }

  .no-axles-message {
    text-align: center;
    color: #ccc;
    margin-top: 20px;
  }

  /* TransitionGroup styles */
  .list-transition-enter-active,
  .list-transition-leave-active {
    transition: all 0.5s ease;
  }

  .list-transition-enter-from,
  .list-transition-leave-to {
    opacity: 0;
    transform: translateX(-30px);
  }

  /* ensure leaving items animate out of position even if they are not displayed */
  .list-transition-leave-active {
    position: absolute;
  }

  .list-transition-move {
    transition: transform 0.5s ease;
  }

  @media (max-width: 800px) {
    aside {
      background-color: rgba(0, 0, 0, 0.8);
      width: 100%;
    }
    aside::before {
      content: '';
      position: absolute;
      inset: 0;
      backdrop-filter: blur(10px);
      z-index: -1;
      border-radius: inherit;
    }
  }
</style>
