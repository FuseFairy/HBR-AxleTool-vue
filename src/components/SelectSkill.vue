<script setup>
import { ref, computed } from 'vue';
import { useSliderStore } from '@/stores/slider_stores';
import { useSkillStore } from '@/stores/skill_stores';
import Multiselect from '@vueform/multiselect';
import SelectAxleChar from './SelectAxleChar.vue';

const sliderStore = useSliderStore();
const skillStores = useSkillStore();
const odOptions = ["OD1", "OD2", "OD3"];

const turnOptions = computed(() => {
  const options = Array.from({ length: sliderStore.rows }, (_, i) => `T${i + 1}`);
  const allOptions = ['追加回合', ...options];

  skillStores.turns.forEach(turn => {
    if (!allOptions.includes(turn.turn)) {
      turn.turn = null;
      turn.od = null;
    }
  });

  return allOptions;
});

const activeComponent = ref({ row: null, buttonKey: null });
const handleBoxClick = (row, key) => {
  activeComponent.value = { row, buttonKey: key };
};

const closeContainer = () => {
  activeComponent.value = { row: null, buttonKey: null };
};
</script>

<template>
  <div v-for="i in sliderStore.rows" :key="i" class="container">
    <div class="column">
      <div class="empty"></div>
      <Multiselect
        v-model="skillStores.turns[i-1].turn"
        placeholder="Select turn"
        :options="turnOptions">
      </Multiselect>
      <Multiselect
        v-model="skillStores.turns[i-1].od"
        placeholder="Select OD"
        :options="odOptions">
      </Multiselect>
    </div>
    <div class="column" v-for="n in 3" :key="n">
      <button @click="handleBoxClick(i-1, n-1)">Button {{ n-1 }}</button>
      <select></select>
      <select></select>
    </div>
  </div>
  <SelectAxleChar
    v-if="activeComponent.row !== null"
    :row="activeComponent.row"
    :buttonKey="activeComponent.buttonKey"
    @close="closeContainer"
  />
</template>

<style src="@vueform/multiselect/themes/default.css" />
<style scoped>
.container {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-radius: 20px;
  background: rgba(68, 65, 65, 0.3);
  margin: 20px 20px 0 20px;
}
.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.empty {
  height: 30px;
}
button, select {
  width: 100px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
button {
  background-color: #3498db;
  color: white;
  cursor: pointer;
}
button:hover {
  background-color: #2980b9;
}
:deep(.multiselect-option){
  display: flex;
  gap: 0.5rem;
}
:deep(.multiselect){
  background-color: black;
  border: 1px solid rgb(64, 68, 141);
}
:deep(.multiselect.is-active){
  box-shadow: none;
}
:deep(.multiselect-dropdown){
  background-color: black;
  border: 1px solid rgb(64, 68, 141);
}
:deep(.multiselect-dropdown::-webkit-scrollbar){
  width: 5px;
}
:deep(.multiselect-dropdown::-webkit-scrollbar-track),
:deep(.multiselect-dropdown::-webkit-scrollbar-thumb) {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
:deep(.multiselect-dropdown::-webkit-scrollbar-thumb) {
    background-color: #555;
}
:deep(.multiselect-option.is-selected){
  background-color: rgb(60, 57, 57);
}
:deep(.multiselect-option.is-pointed){
  background-color: rgb(160, 160, 167);
  color: rgb(0, 0, 0);
}
:deep(.multiselect-caret){
  margin-left: 14px;
}
:deep(.multiselect-clear){
  padding: 0;
}
:deep(.multiselect-clear-icon:hover),
:deep(.multiselect-clear-icon:active),
:deep(.multiselect-clear-icon:focus) {
    background-color: #999;
}
</style>
