<script setup>
  import { ref } from 'vue'
  import { v5 as uuidv5 } from 'uuid'
  import { compressAxleData } from '@/utils/axle/compressAxleData'
  import { toast } from 'vue3-toastify'
  import { uploadDate } from '@/utils/axle/axleDataApi'

  const MY_NAMESPACE = 'f1fe056a-f52e-4062-9c8a-03659d1893d0'
  const isLoading = ref(false)

  async function triggerShareLink() {
    isLoading.value = true
    try {
      const data = compressAxleData()
      const axle_id = uuidv5(data, MY_NAMESPACE)
      const clipboardItemOut = new ClipboardItem({
        'text/plain': uploadDate(axle_id, data).then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          const shareUrl = `${window.location.href}?axle_id=${axle_id}`
          return new Blob([shareUrl], { type: 'text/plain' })
        }),
      })
      await navigator.clipboard.write([clipboardItemOut])
      toast('Copy success!', {
        theme: 'dark',
        type: 'success',
        transition: 'zoom',
        position: 'bottom-center',
        autoClose: 300,
        dangerouslyHTMLString: true,
        newestOnTop: true,
        limit: 1,
        toastStyle: {
          'font-family': 'var(--font-family-sans)',
        },
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to upload data or copy URL: ' + error.message)
    } finally {
      isLoading.value = false
    }
  }
</script>

<template>
  <button
    v-tooltip="{ content: isLoading ? 'Uploading...' : 'Share', placement: 'bottom' }"
    class="share-button flex items-center justify-center"
    :disabled="isLoading"
    @click="triggerShareLink">
    <div v-if="isLoading" class="loading-spinner" />
    <img v-else src="@/assets/custom-icon/share.svg" alt="Share" />
  </button>
</template>

<style scoped>
  .share-button {
    background-color: transparent;
    padding: 1px;
    border: none;
    box-sizing: border-box;
    height: 32px;
    width: 32px;
    cursor: pointer;
    border-radius: 30%;
    transition: background-color 0.2s ease;
  }
  .share-button:hover:not(:disabled) {
    background-color: rgba(78, 69, 69, 0.3);
  }
  .share-button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
