<script setup>
  import { v5 as uuidv5 } from 'uuid'
  import { compressAxleData } from '@/utils/compressAxleData'
  import { toast } from 'vue3-toastify'
  import { uploadDate } from '@/utils/axleDataApi'

  const MY_NAMESPACE = 'f1fe056a-f52e-4062-9c8a-03659d1893d0'
  const isLoading = defineModel('isLoading', { type: Boolean, default: false })

  async function triggerShareLink() {
    isLoading.value = true
    try {
      const data = compressAxleData()
      const axle_id = uuidv5(data, MY_NAMESPACE)
      
      const clipboardItemOut = new ClipboardItem({
        "text/plain": uploadDate(axle_id, data).then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          const shareUrl = `${window.location.href}?axle_id=${axle_id}`
          return new Blob([shareUrl], { type: 'text/plain' })
        })
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
          'font-family': 'LXGW WenKai Mono TC',
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
  <button @click="triggerShareLink" class="share-button" v-tooltip="{ content: 'Share', placement: 'bottom' }">
    <img src="@/assets/custom-icon/share.svg" alt="Share" />
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
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .share-button:hover {
    background-color: rgba(78, 69, 69, 0.3);
  }
</style>
