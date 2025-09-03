<script setup>
  import { toast } from 'vue3-toastify'
  import { convertElementToJpg } from '@/utils/browser/domToImage'
  import { useUiStore } from '@/store/ui'

  const uiStore = useUiStore()
  const isLoading = defineModel('isLoading', { type: Boolean, default: false })

  const downloadTable = async () => {
    isLoading.value = true
    try {
      const elementId = 'show-axle'

      await convertElementToJpg(elementId)
    } catch (error) {
      console.error('Error during download:', error)
      toast('Download error occurred, please use Chrome, Edge browser to download as much as possible.', {
        theme: 'colored',
        type: 'error',
        position: 'top-right',
        autoClose: 3000,
        dangerouslyHTMLString: true,
        newestOnTop: true,
        limit: 1,
        toastStyle: {
          'font-family': 'var(--font-family-sans)',
        },
      })
    } finally {
      isLoading.value = false
    }
  }
</script>

<template>
  <button class="download flex items-center justify-center" :disabled="uiStore.sliderRows <= 0" @click="downloadTable">
    <img src="@/assets/custom-icon/download.svg" alt="Download" />
  </button>
</template>

<style scoped>
  .download {
    background-color: transparent;
    padding: 1px;
    border: none;
    box-sizing: border-box;
    height: 32px;
    width: 32px;
    cursor: pointer;
    border-radius: 30%;
  }
  .download:hover {
    background-color: rgba(78, 69, 69, 0.3);
  }
  .download:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
