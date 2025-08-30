<script setup>
  import { useSkillStore } from '@/store/axle'
  import { useSliderStore } from '@/store/slider'
  import { getAssetsFile } from '@/utils/assets/getAssetsFile'
  import { compressAxleData } from '@/utils/axle/compressAxleData'
  import { useAxleCollectionStore } from '@/store/axleCollection'
  import { toast } from 'vue3-toastify'

  const skillStore = useSkillStore()
  const sliderStore = useSliderStore()
  const maxlength = 35
  const axleCollectionStore = useAxleCollectionStore()
  const toastOptions = {
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
  }

  const handleSaveAxle = () => {
    const compressedData = compressAxleData()

    // Update existing axle
    axleCollectionStore.updateAxleData(skillStore.axleId, skillStore.axleName.trim(), compressedData)

    toast('Axle updated!', toastOptions)
  }

  const handleSaveAsAxle = () => {
    const compressedData = compressAxleData()
    const axleName = skillStore.axleName
    const currentTime = new Date().toLocaleString()
    const newAxleId = axleCollectionStore.addAxle({ name: axleName, data: compressedData, time: currentTime })
    skillStore.axleId = newAxleId // Update skillStore with the new axle's ID

    toast('Axle saved as new!', toastOptions)
  }
</script>

<template>
  <div class="axle-name-input-container">
    <p class="form-label">Axle Name</p>
    <div class="input-with-button">
      <input
        v-model="skillStore.axleName"
        type="text"
        placeholder="Enter your axle name"
        class="form-input"
        :maxlength="maxlength" />
      <button
        v-tooltip="'Save Axle'"
        class="save-axle-button"
        :disabled="skillStore.axleId === ''"
        @click="handleSaveAxle">
        <img :src="getAssetsFile('custom-icon/save.svg')" alt="Save Axle" />
      </button>
      <button
        v-tooltip="'Save Axle As New'"
        class="save-as-axle-button"
        :disabled="sliderStore.rows <= 0"
        @click="handleSaveAsAxle">
        <img :src="getAssetsFile('custom-icon/save_as.svg')" alt="Save As Axle" />
      </button>
    </div>
    <p class="char-counter">{{ skillStore.axleName.length }} / {{ maxlength }}</p>
  </div>
</template>

<style scoped>
  .axle-name-input-container {
    flex-grow: 1;
  }
  .input-with-button {
    position: relative;
    display: flex;
    align-items: center;
  }
  .save-axle-button,
  .save-as-axle-button {
    background-color: transparent;
    border: none;
    box-sizing: border-box;
    height: 36px;
    width: 36px;
    cursor: pointer;
    border-radius: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 5px;
    transition: filter 0.2s ease-in-out;
  }
  .save-axle-button {
    right: 45px; /* Position the save button to the left of save-as */
  }
  .save-axle-button:hover,
  .save-as-axle-button:hover {
    filter: brightness(1.6);
  }
  .save-axle-button:disabled,
  .save-as-axle-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    filter: none;
  }
  .form-label {
    font-family: var(--font-family-serif);
    color: var(--primary-light-color);
  }
  .form-input {
    background-color: rgba(151, 107, 135, 0.5);
    color: white;
    border: none;
    padding: var(--spacing-2);
    padding-right: 85px; /* Add padding to the right to make space for two buttons */
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
  }
  .form-input:focus {
    outline: none;
  }
  .char-counter {
    color: gray;
    font-size: 0.8rem;
    text-align: right;
    margin-top: 0;
  }
</style>
