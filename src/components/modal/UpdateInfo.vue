<script setup>
  import { ref, onMounted } from 'vue'
  import { getAssetsFile } from '@/utils/getAssetsFile'

  const emit = defineEmits(['close'])
  const closeContainer = () => {
    emit('close')
  }

  const updates = ref([])
  const isLoading = ref(true)
  const errorMessage = ref('')
  const expandedSections = ref({})
  const unreadUpdates = ref(new Set())

  // Load viewed updates from localStorage
  const viewedUpdates = ref(new Set(JSON.parse(localStorage.getItem('viewedUpdates') || '[]')))

  const toggleSection = (date) => {
    expandedSections.value[date] = !expandedSections.value[date]
    // Mark as read when expanded
    if (expandedSections.value[date]) {
      unreadUpdates.value.delete(date)
      viewedUpdates.value.add(date)
      localStorage.setItem('viewedUpdates', JSON.stringify([...viewedUpdates.value]))
    }
  }

  onMounted(async () => {
    try {
      const assetUrl = getAssetsFile('updates/updates-zh-TW.json')
      const response = await fetch(assetUrl, { method: 'GET' })

      if (!response.ok) {
        throw new Error(`Failed to load updates: ${response.status} ${response.statusText}`)
      }

      updates.value = await response.json()

      // Initialize expanded state and check for unread updates
      updates.value.forEach((update) => {
        expandedSections.value[update.date] = false
        if (!viewedUpdates.value.has(update.date)) {
          unreadUpdates.value.add(update.date)
        }
      })
    } catch (error) {
      console.error('Failed to load updates:', error)
      errorMessage.value = '無法載入更新資訊，請稍後再試。'
    } finally {
      isLoading.value = false
    }
  })
</script>

<template>
  <div @click="closeContainer" class="overlay">
    <div @click.stop class="container">
      <div class="button-group">
        <span class="title">Update</span>
        <button @click="closeContainer" class="close">
          <img src="@/assets/custom-icon/close.svg" alt="Close" />
        </button>
      </div>
      <div class="section scrollbar-style-1">
        <div v-if="isLoading" class="loading">Loading...</div>
        <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
        <div v-else class="updates-content">
          <div v-for="update in updates" :key="update.date" class="update-item" :data-date="update.date">
            <div class="update-header" @click="toggleSection(update.date)">
              <span class="update-date">{{ update.date }}</span>
              <span v-if="unreadUpdates.has(update.date)" class="unread-dot"></span>
              <span class="toggle-icon">{{ expandedSections[update.date] ? '−' : '+' }}</span>
            </div>
            <div class="update-content-wrapper" :class="{ expanded: expandedSections[update.date] }">
              <div class="update-content">
                <div v-if="update.features?.length" class="category">
                  <h2>✨ 新功能</h2>
                  <ul>
                    <li v-for="feature in update.features" :key="feature">{{ feature }}</li>
                  </ul>
                </div>
                <div v-if="update.bugFixes?.length" class="category">
                  <h2>🛠️ 錯誤修正</h2>
                  <ul>
                    <li v-for="fix in update.bugFixes" :key="fix">{{ fix }}</li>
                  </ul>
                </div>
                <div v-if="update.additions?.length" class="category">
                  <h2>📌 新增內容</h2>
                  <ul>
                    <li v-for="addition in update.additions" :key="addition.text">
                      <span>{{ addition.text }}</span>
                      <div v-if="addition.images?.length" class="image-grid">
                        <img
                          v-for="img in addition.images"
                          :key="img"
                          :src="getAssetsFile(img)"
                          alt="Update image"
                          class="update-image"
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .button-group {
    display: flex;
    align-items: center;
    height: auto;
    padding: 10px;
  }
  .title {
    color: rgb(209, 228, 222);
    font-family: 'Gugi', 'Noto Sans TC', sans-serif;
    font-size: 1.3rem;
    font-weight: bold;
    margin: 0 auto;
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
    cursor: pointer;
    flex-shrink: 0;
  }
  .close img {
    height: 100%;
    width: 100%;
  }
  .section {
    display: flex;
    position: relative;
    width: 100%;
    overflow: auto;
    padding: 1rem;
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
    max-height: 70%;
    width: 60%;
    padding: 1rem;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    border: 3px solid rgb(31, 44, 52);
    background-image: url(@/assets/common/bg.webp);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .loading,
  .error {
    color: rgb(209, 228, 222);
    font-family: 'Noto Sans TC', sans-serif;
    text-align: center;
    padding: 1rem;
  }
  .updates-content {
    color: rgb(209, 228, 222);
    font-family: 'LXGW WenKai Mono TC', sans-serif;
    line-height: 1.6;
    width: 100%;
  }
  .update-item {
    margin-bottom: 0.5rem;
    border-bottom: 1px solid rgb(100, 100, 100);
  }
  .update-header {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    cursor: pointer;
  }
  .update-date {
    font-size: 1.2rem;
    font-weight: bold;
    color: rgb(255, 255, 255);
    flex-grow: 1;
  }
  .unread-dot {
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
  .toggle-icon {
    font-size: 1.2rem;
    color: rgb(100, 181, 246);
  }
  .update-content {
    padding: 0.5rem 1rem;
  }
  .category {
    margin-bottom: 1rem;
  }
  .category h2 {
    font-size: 1.4rem;
    color: rgb(230, 230, 230);
    margin-bottom: 0.5rem;
  }
  .category ul {
    list-style-type: disc;
    padding-left: 1.5rem;
  }
  .category li {
    margin: 0.3rem 0;
  }
  .image-grid {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
    flex-wrap: wrap;
  }
  .update-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
  .scrollbar-style-1::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-style-1 {
    scrollbar-width: none;
  }
  .update-content-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .update-content-wrapper.expanded {
    grid-template-rows: 1fr;
  }

  .update-content {
    padding: 0 1rem;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .update-content-wrapper.expanded .update-content {
    opacity: 1;
    padding: 0.5rem 1rem;
    transition:
      opacity 0.25s ease 0.1s,
      padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (max-width: 800px) {
    .container {
      width: 90%;
      padding: 1rem;
    }
    .title {
      font-size: 1rem;
    }
    .update-date {
      font-size: 1rem;
    }
    .category h2 {
      font-size: 1.2rem;
    }
    .update-image {
      width: 60px;
      height: 60px;
    }
  }
</style>
