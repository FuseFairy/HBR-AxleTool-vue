<script setup>
  import { ref } from 'vue'
  import piexif from 'piexifjs'
  import loading from 'vue-loading-overlay'
  import { decompressAxleData } from '@/utils/axle/decompressAxleData'

  const fileInput = ref(null)
  const isLoading = ref(false)
  const triggerFileInput = () => fileInput.value.click()

  const onFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file || !['image/jpeg', 'image/jpg'].includes(file.type)) {
      alert('Please upload a JPEG image file!')
      return
    }

    try {
      isLoading.value = true
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result

          let binaryString = ''
          const bytes = new Uint8Array(arrayBuffer)
          const length = bytes.byteLength
          for (let i = 0; i < length; i++) {
            binaryString += String.fromCharCode(bytes[i])
          }

          const exifObj = piexif.load(binaryString)
          const customData = exifObj['Exif'][piexif.ExifIFD.UserComment] || ''

          if (!customData) {
            throw new Error('Custom metadata not found.')
          }

          await decompressAxleData(customData)
        } catch (error) {
          alert(error)
        } finally {
          event.target.value = ''
          isLoading.value = false
        }
      }
    } catch {
      alert('Failed to read the file. Please try again.')
    }
  }
</script>

<template>
  <loading
    v-model:active="isLoading"
    :can-cancel="false"
    :is-full-page="true"
    :lock-scroll="true"
    background-color="#54504b"
    loader="dots"
    color="#79d1cb" />
  <button v-tooltip="{ content: 'Upload', placement: 'bottom' }" class="upload-button" @click="triggerFileInput">
    <img src="@/assets/custom-icon/upload.svg" alt="Upload" />
  </button>
  <input ref="fileInput" type="file" accept=".jpg,.jpeg" style="display: none" @change="onFileChange" />
</template>

<style scoped>
  .upload-button {
    background-color: transparent;
    padding: var(--spacing-1);
    border: none;
    height: 36px;
    width: 36px;
    cursor: pointer;
    border-radius: 30%;
    transition: background-color 0.3s;
  }
  .upload-button:hover {
    background-color: rgba(78, 69, 69, 0.3);
  }
</style>
