<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useCharStore } from '@/store/char'
  import { useShowRowStore } from '@/store/showRow.js'
  import { useShowTeamStore } from '@/store/showTeam'
  import { getAssetsFile } from '@/utils/assets/getAssetsFile'
  import { getUsedTeams } from '@/utils/state-getters/getUsedTeams'
  import Multiselect from '@vueform/multiselect'
  import filterOffIcon from '@/assets/custom-icon/filter-off.svg'
  import filterOnIcon from '@/assets/custom-icon/filter-on.svg'

  const charStore = useCharStore()
  const showRowStore = useShowRowStore()
  const showTeamStore = useShowTeamStore()
  const usedTeam = getUsedTeams()

  showTeamStore.showTeam = usedTeam

  const showOptions = [
    { value: 'rank', name: 'Rank' },
    { value: 'earring', name: 'Earring' },
    { value: 'passive skill', name: 'Passive Skill' },
    { value: 'skill', name: 'Skill' },
    { value: 'axle', name: 'Axle' },
    { value: 'spiritual', name: 'Spiritual' },
  ]
  const showTeams = usedTeam.map((teamValue) => ({ value: teamValue, name: `Team ${teamValue}` }))

  const show = ref(false)
  const filterRef = ref(null)

  const handleClickOutside = (event) => {
    if (!show.value) return

    const target = event.target
    const isClickInsideComponent = filterRef.value && filterRef.value.contains(target)
    const isClickInsideMultiselectDropdown = target.closest('.multiselect-dropdown')

    if (!isClickInsideComponent && !isClickInsideMultiselectDropdown) {
      show.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
  })
</script>

<template>
  <div ref="filterRef">
    <button class="filter flex items-center justify-center" @click.stop="show = !show">
      <img :src="show ? filterOffIcon : filterOnIcon" alt="Filter" />
    </button>
    <div v-if="show" class="filter-content">
      <label>Teams</label>
      <Multiselect
        v-model="showTeamStore.showTeam"
        mode="tags"
        placeholder="Display Team"
        label="name"
        :close-on-select="false"
        :options="showTeams"
        style="margin-left: 5px"
        @change="(value) => showTeamStore.setShowTeam(value)">
        <template #option="{ option }">
          <div class="option-container">
            <span :title="option.name">{{ option.name }}</span>
            <div class="option-images">
              <div v-for="(item, index) in charStore.selections[option.value]" :key="index">
                <img v-if="item.img" :src="getAssetsFile(item.img)" :alt="item.style" class="option-icon" />
              </div>
            </div>
          </div>
        </template>
      </Multiselect>

      <label style="margin-top: 10px">Others</label>
      <Multiselect
        v-if="show"
        v-model="showRowStore.showRow"
        mode="tags"
        placeholder="Display Row"
        label="name"
        :close-on-select="false"
        :options="showOptions"
        style="margin-left: 5px"
        @change="(value) => showRowStore.setShowRow(value)" />
    </div>
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css" />
<style scoped>
  .filter-content {
    position: absolute;
    display: flex;
    flex-direction: column;
    background-color: var(--filter-bg-color);
    border-radius: 15px;
    width: 30vw;
    max-width: 35vw;
    padding: 15px;
    z-index: 1500;
  }
  label {
    font-family: var(--font-family-serif);
    color: rgb(182, 208, 226);
  }
  .option-icon {
    width: 34px;
    height: 34px;
  }
  .option-container {
    display: flex;
    flex-direction: column;
  }
  .option-images {
    display: flex;
    flex-wrap: wrap;
    padding-top: 1px;
    gap: 8px;
  }
  .filter {
    background-color: transparent;
    padding: 1px;
    border: none;
    box-sizing: border-box;
    height: 32px;
    width: 32px;
    cursor: pointer;
    border-radius: 30%;
  }
  .filter:hover {
    background-color: rgba(78, 69, 69, 0.3);
  }
  :deep(.multiselect-option),
  .multiselect-single-label {
    display: flex;
    color: white;
  }
  :deep(.multiselect) {
    background-color: rgba(50, 48, 50, 0.8);
    border: 2px solid rgba(50, 48, 50, 0.8);
    margin-top: 2px;
    border-radius: 20px;
    width: 100%;
  }
  :deep(.multiselect.is-active) {
    box-shadow: none;
  }
  :deep(.multiselect-dropdown) {
    background-color: rgba(50, 48, 50, 0.8);
    border: 2px solid rgba(50, 48, 50, 0.8);
    border-radius: 20px;
  }
  :deep(.multiselect-dropdown::-webkit-scrollbar) {
    width: 0px;
  }
  :deep(.multiselect-option.is-selected) {
    background-color: rgb(38, 37, 37);
  }
  :deep(.multiselect-option.is-pointed) {
    background-color: rgb(160, 160, 167);
    color: rgb(0, 0, 0);
  }
  :deep(.multiselect-caret) {
    margin-left: 14px;
  }
  :deep(.multiselect-clear) {
    padding: 0;
  }
  :deep(.multiselect-clear-icon:hover),
  :deep(.multiselect-clear-icon:active),
  :deep(.multiselect-clear-icon:focus) {
    background-color: #999;
  }
  :deep(.multiselect-clear-icon) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 100%;
    font-size: 0;
  }
  :deep(.multiselect-tag) {
    background-color: rgb(89, 85, 89);
    border-radius: 20px;
  }
  :deep(.multiselect-wrapper) {
    margin: 0;
    width: 100%;
  }
  @media (max-width: 950px) {
    .filter-content {
      width: 45vw;
      max-width: 50vw;
    }
    :deep(.multiselect-dropdown) {
      max-height: 33vh;
    }
  }
</style>
