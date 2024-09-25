<script setup>
import { computed } from 'vue'
import { useCharStore } from '@/stores/char_stores';
import { useSkillStore } from '@/stores/skill_stores';
import { useSliderStore } from '@/stores/slider_stores';
import { convertElementToPng } from '@/api/domToImage';

const charStore = useCharStore();
const skillStore = useSkillStore();
const sliderStore = useSliderStore();
const hasRank = computed(() => {
  return Object.values(charStore.selections).some(selection => selection?.rank !== null || selection?.flower);
});

const hasEarring = computed(() => {
  return Object.values(charStore.selections).some(selection => selection?.earring !== null);
});

const hasPassiveSkill = computed(() => {
  return Object.values(charStore.selections).some(selection => selection?.passiveSkill !== null && selection?.passiveSkill.length > 0);
});

const downloadTable = async () => {
  await convertElementToPng('show-axle');
};

const emit = defineEmits(['close']);
const closeTable = () => {
  emit('close');
};
</script>

<template>
<div @click="closeTable" class="overlay">
  <div @click.stop class="container">
    <div class="button-group">
      <button @click="downloadTable" class="download"> 
        <img src="@/assets/custom_icon/download.svg" alt="Download">
      </button>
      <button @click="closeTable" class="close"> 
        <img src="@/assets/custom_icon/close.svg" alt="Close">
      </button>
    </div>
    <div id="show-axle" class="table scrollbar-style-1">
      <div class="table-wrapper">
        <!-- Image row -->
        <div class="table-container">
          <div v-for="i in 7" class="table-column">
            <div v-if="i === 1"></div>
            <img v-else-if="charStore.selections[i-1].img" 
                :src="charStore.selections[i-1].img" 
                :alt="charStore.selections[i-1].style" 
                class="character-image">
          </div>
        </div>
        <!-- Rank row -->
        <div v-if="hasRank" class="table-container" style="margin-top: 20px;">
          <div v-for="i in 7" class="table-column">
            <div v-if="i === 1" class="label">Rank</div>
            <div v-else-if="charStore.selections[i-1].rank !== null" class="text">
              {{ charStore.selections[i-1].rank }}
              <img v-if="charStore.selections[i-1].flower" src="/src/assets/flower.webp" alt="flower" class="flower-img"/>
            </div>
            <div v-else-if="charStore.selections[i-1].rank === null && charStore.selections[i-1].style !== null" class="text">
              <span>0</span>
              <img v-if="charStore.selections[i-1].flower" src="/src/assets/flower.webp" alt="flower" class="flower-img"/>
            </div>
          </div>
        </div>
        <!-- Earring row -->
        <div v-if="hasEarring" class="table-container" style="margin-top: 20px;">
          <div v-for="i in 7" class="table-column">
            <div v-if="i === 1" class="label">Earring</div>
            <div v-else-if="charStore.selections[i-1].earring !== null" class="text">{{ charStore.selections[i-1].earring }}</div>
          </div>
        </div>
        <!-- Passive Skill row -->
        <div v-if="hasPassiveSkill" class="table-container" style="margin-top: 20px;">
          <div v-for="i in 7" class="table-column">
            <div v-if="i === 1" class="label">Passive<br>Skill</div>
            <div v-else-if="charStore.selections[i-1].passiveSkill !== null && charStore.selections[i-1].passiveSkill.length > 0" class="text">
              {{ charStore.selections[i-1].passiveSkill.join(', ') }}
            </div>
          </div>
        </div>
        <!-- Skill row -->
        <div v-if="sliderStore.rows > 0" class="axle-line-container" style="margin-top: 20px;">
          <div class="axle-column"></div>
        </div>
        <div v-if="sliderStore.rows > 0" v-for="row in sliderStore.rows" class="table-container-2" :style="{ 'margin-top': '20px', 'border-top': row > 1 ? '2px dashed gray' : 'none', 'padding-top': row > 1 ? '20px' : 'none' }">
          <div v-for="col in 4" class="axle-table-column">
            <div v-if="col === 1" class="label">
              <span v-if="skillStore.turns[row-1].turn !== null && skillStore.turns[row-1].od !== null">
                {{ skillStore.turns[row-1].turn }} / {{ skillStore.turns[row-1].od }}
              </span>
              <span v-else-if="skillStore.turns[row-1].turn !== null">{{ skillStore.turns[row-1].turn }}</span>
              <span v-else></span>
            </div>
            <div v-else>
              <span v-if="skillStore.skills[row-1][col-2].skill !== null">
                <img :src="skillStore.skills[row-1][col-2].style_img" :alt="skillStore.skills[row-1][col-2].style" class="axle-img"/>
                <span class="axle-text">{{ skillStore.skills[row-1][col-2].skill }}</span>
                <span v-if="skillStore.skills[row-1][col-2].target !== null" class="axle-text"><br>（{{ skillStore.skills[row-1][col-2].target }}）</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.table-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.table-container {
  display: grid;
  grid-template-columns: 10dvw repeat(6, 1fr);
  margin: 0 10px;
  width: inherit;
}
.table-container-2 {
  display: grid;
  grid-template-columns: 10dvw repeat(3, 1fr);
  margin: 0 10px;
  width: inherit;
}
.axle-line-container {
  display: grid;
  grid-template-columns: 1fr;
  margin: 0 10px;
  width: inherit;
}
.table-column {
  margin-right: 10px;
  display: flex;
  flex-direction: column; 
  align-items: center;
}
.axle-table-column {
  display: flex;
  flex-direction: column; 
  text-align: center;
  justify-content: center;
  align-items: center;
}
.axle-img {
  margin-right: 5px;
  height: 40px;
  width: 40px;
  vertical-align: middle;
}
.axle-column {
  display: flex;
  flex-direction: column; 
  align-items: center;
  border-top: 2px solid #d64040;
}
.label {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  display: flex; 
  justify-content: center;
  align-items: center;
  height: 100%;
}
.character-image {
  width: 70px;
  height: 70px;
  object-fit: contain;
}
.text {
  display: flex;
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.axle-text {
  font-size: 18px;
  font-weight: normal;
  height: 100%;
  vertical-align: middle;
}
.flower-img {
  margin-left: 5px;
  height: 20px;
  width: 20px;
}
.close{
  background-color: transparent;
  padding: 1px;
  border: none;
  box-sizing: border-box;
  height: 32px;
  width: 32px;
  cursor: pointer;
}
.download {
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
.download:hover {
  background-color: rgba(78, 69, 69, 0.3)
}
.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close img{
  height: 100%;
  width: 100%;
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
  height: 90%;
  width: 90%;
  box-sizing: border-box;
  padding: 1rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
}
.table {
  display: flex;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 1rem 1rem 0 0;
}
.scrollbar-style-1 {
  overflow-x: auto;
}
.scrollbar-style-1::-webkit-scrollbar {
  width: 5px;
  height: 0;
}
.scrollbar-style-1::-webkit-scrollbar-track,
.scrollbar-style-1::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.scrollbar-style-1::-webkit-scrollbar-thumb {
  background-color: #555;
}
</style>