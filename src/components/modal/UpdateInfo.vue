<script setup>
  import { ref, onMounted } from 'vue'
  import { marked } from 'marked'
  import DOMPurify from 'dompurify'
  import { getAssetsFile } from '@/utils/getAssetsFile'

  const emit = defineEmits(['close'])
  const closeContainer = () => {
    emit('close')
  }

  // Markdown 內容和渲染結果
  const markdownContent = ref('')
  const renderedContent = ref('')
  const isLoading = ref(true)
  const errorMessage = ref('')

  // marked 渲染器以處理圖片路徑
  const renderer = new marked.Renderer()
  renderer.image = (href, title, text) => {
    const assetUrl = getAssetsFile(href.href)
    return `<img src="${assetUrl}" alt="${text}" ${title ? `title="${title}"` : ''} hight="80px" width="80px" loading="lazy">`
  }

  // 配置 marked 使用自訂渲染器
  marked.setOptions({
    renderer,
    gfm: true,
    breaks: true,
  })

  onMounted(async () => {
    try {
      const lang = 'zh-TW'
      const assetUrl = getAssetsFile(`updates/updates-${lang}.md`)
      
      const response = await fetch(assetUrl, { method: 'GET' })
      
      if (!response.ok) {
        throw new Error(`Failed to load updates-${lang}.md: ${response.status} ${response.statusText}`)
      }
      
      markdownContent.value = await response.text()
      renderedContent.value = DOMPurify.sanitize(marked.parse(markdownContent.value))
    } catch (error) {
      console.error('Failed to load Markdown:', error)
      errorMessage.value = '# 錯誤\n無法載入更新資訊，請稍後再試。'
      renderedContent.value = DOMPurify.sanitize(marked.parse(errorMessage.value))
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
        <div v-else class="markdown-content" v-html="renderedContent"></div>
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
  }
  .loading {
    color: rgb(209, 228, 222);
    font-family: 'Noto Sans TC', sans-serif;
    text-align: center;
    padding: 1rem;
  }
  .markdown-content {
    color: rgb(209, 228, 222);
    font-family: 'LXGW WenKai Mono TC', sans-serif;
    line-height: 1.6;
    height: 100%;
  }
  .markdown-content :deep(h1) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: rgb(255, 255, 255);
    font-family: 'LXGW WenKai Mono TC', sans-serif;
  }
  .markdown-content :deep(h2) {
    font-size: 1.4rem;
    margin: 1rem 0 0.5rem;
    color: rgb(230, 230, 230);
  }
  .markdown-content :deep(h3) {
    font-size: 1.2rem;
    margin: 0.8rem 0 0.4rem;
    color: rgb(200, 200, 200);
  }
  .markdown-content :deep(p) {
    margin: 0.5rem 0;
  }
  .markdown-content :deep(ul) {
    list-style-type: disc;
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
  .markdown-content :deep(li) {
    margin: 0.3rem 0;
  }
  .markdown-content :deep(a) {
    color: rgb(100, 181, 246);
    text-decoration: none;
  }
  .markdown-content :deep(a:hover) {
    text-decoration: underline;
  }
  .markdown-content :deep(strong) {
    font-weight: bold;
    color: rgb(255, 255, 255);
  }
  .markdown-content :deep(em) {
    font-style: italic;
  }
  .markdown-content :deep(blockquote) {
    border-left: 3px solid rgb(100, 181, 246);
    padding-left: 1rem;
    margin: 1rem 0;
    color: rgb(180, 180, 180);
  }
  .markdown-content :deep(hr) {
    border: none;
    border-top: 1px solid rgb(100, 100, 100);
    margin: 0;
  }
  .markdown-content :deep(img) {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0.5rem 0;
  }
  .scrollbar-style-1::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-style-1 {
    scrollbar-width: none; /* Firefox */
  }
  .markdown-content :deep(table) {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-collapse: collapse;
  }
  .markdown-content :deep(tr) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .markdown-content :deep(th),
  .markdown-content :deep(td) {
    min-width: 100px;
    text-align: left;
    color: rgb(209, 228, 222);
  }
  @media (max-width: 800px) {
    .container {
      width: 90%;
      padding: 1rem;
    }
    .title {
      font-size: 1rem;
    }
    .markdown-content :deep(h1) {
      font-size: 1.5rem;
    }
    .markdown-content :deep(h2) {
      font-size: 1.2rem;
    }
    .markdown-content :deep(h3) {
      font-size: 1rem;
    }
    .markdown-content :deep(th),
    .markdown-content :deep(td) {
      min-width: 80px;
      padding: 0.3rem;
    }
  }
</style>
