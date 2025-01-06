<script setup>
import { ref } from 'vue'
import { useCharStore } from '@/stores/char_stores'
import { useShowRowStore } from '@/stores/showRow_stores.js'
import { useShowTeamStore } from '@/stores/showTeam_stores'
import { getAssetsFile } from '@/api/util'
import { onClickOutside } from '@vueuse/core'
import Multiselect from '@vueform/multiselect'

const charStore = useCharStore()
const showRowStore = useShowRowStore()
const showTeamStore = useShowTeamStore()

const showOptions = [
  { value: 'rank', name: 'Rank' },
  { value: 'earring', name: 'Earring' },
  { value: 'passive skill', name: 'Passive Skill' },
  { value: 'skill', name: 'Skill' },
  { value: 'axle', name: 'Axle' }
]
const showTeams = [
  { value: 1, name: 'Team 1' },
  { value: 2, name: 'Team 2' },
  { value: 3, name: 'Team 3' },
  { value: 4, name: 'Team 4' },
  { value: 5, name: 'Team 5' },
  { value: 6, name: 'Team 6' }
]

const show = ref(false)
const filterRef = ref(null)
onClickOutside(
  filterRef,
  (event) => {
    show.value = false
  },
)
</script>

<template>
<div ref="filterRef">
	<button @click="show = !show" class="filter">
		<img
		:src="show ? './src/assets/custom_icon/filter-off.svg' : './src/assets/custom_icon/filter-on.svg'"
		alt="Filter"
		/>
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
			@change="(value) => showTeamStore.setShowTeam(value)"
			style="margin-left: 5px"
		>
			<template v-slot:option="{ option }">
			<div class="option-container">
				<span :title="option.name">{{ option.name }}</span>
				<div class="option-images">
					<div v-for="i in 7">
						<img
						v-if="i !== 1 && charStore.selections[option.value][i - 1].img"
						:src="getAssetsFile(charStore.selections[option.value][i - 1].img)"
						:alt="charStore.selections[option.value][i - 1].style"
						class="option-icon"
						/>
					</div>
				</div>
			</div>
			</template>
		</Multiselect>

		<label style="margin-top: 10px;">Others</label>
		<Multiselect
			v-if="show"
			v-model="showRowStore.showRow"
			mode="tags"
			placeholder="Display Row"
			label="name"
			:close-on-select="false"
			:options="showOptions"
			@change="(value) => showRowStore.setShowRow(value)"
			style="margin-left: 5px"
		/>
	</div>
</div>
</template>

<style src="@vueform/multiselect/themes/default.css" />
<style scoped>
.filter-content {
  position: absolute;
	display: flex;
	flex-direction: column;
  background-color: rgba(18, 9, 9, 0.95);
  border-radius: 15px;
  width: 30vw;
  max-width: 35vw;
  padding: 15px;
  z-index: 1500;
}
label {
  font-family: 'Gugi', 'Noto Sans TC', sans-serif;
}
.option-icon {
  width: 34px;
  height: 34px;
  padding-right: 7px;
}
.option-container {
  display: flex;
  flex-direction: column;
}
.option-images {
  display: flex;
  flex-wrap: wrap;
  padding-top: 1px;
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
  display: flex;
  justify-content: center;
  align-items: center;
}
.filter:hover {
  background-color: rgba(78, 69, 69, 0.3);
}
:deep(.multiselect-option),
.multiselect-single-label {
  display: flex;
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