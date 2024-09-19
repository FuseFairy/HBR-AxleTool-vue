<template>
<div class="slider-container">
  <div class="top-container">
      <h2>{{ title }}</h2>
    <div class="input-container">
      <input v-model="sliderStore.rows" disabled="disabled" />
      <button 
          @click="decreaseValue" 
          :class="{ 'disabled-button': sliderStore.rows === 0 }"
          :disabled="sliderStore.rows === 0"
        >
          <img
            :class="['icon', { 'disabled-icon': sliderStore.rows === 0 }]"
            src="/src/assets/custom_icon/remove_w7g2.svg" alt="button - remove a row" />
        </button>
        <button 
          @click="increaseValue" 
          :class="{ 'disabled-button': sliderStore.rows === 50 }"
          :disabled="sliderStore.rows === 50"
        >
          <img
            :class="['icon', { 'disabled-icon': sliderStore.rows === 50 }]"
            src="/src/assets/custom_icon/add_w7g2.svg" alt="button - add a row" />
        </button>
    </div>
  </div>
  <vue-slider 
    v-model="sliderStore.rows"
    :min="0"
    :max="50"
    :interval="1"
    :contained="true"
    :lazy="true"
    :drag-on-click="true"
    :marks="[0, 50]"
    @change="updateSkillsRows">
  </vue-slider>
</div>
</template>

<script setup>
import { useSliderStore } from '@/stores/slider_stores';
import { useSkillStore } from '@/stores/skill_stores';
import VueSlider from 'vue-slider-component'
import '/styles/themes/slider.css'

const title = 'Number Of Rows';
const sliderStore = useSliderStore();
const skillStores = useSkillStore()

const increaseValue = () => {
  if (sliderStore.rows < 50) {
    sliderStore.rows++;
    updateSkillsRows(sliderStore.rows)
  }
};

const decreaseValue = () => {
  if (sliderStore.rows > 0) {
    sliderStore.rows--;
    updateSkillsRows(sliderStore.rows)
  }
};

const updateSkillsRows = (value) => {
	skillStores.adjustSkills(value);
}
</script>

<style scoped>
.top-container {
  margin-bottom: 1.5vh;
  display: flex;
}

.input-container {
  display: flex;
  align-items: center;
  margin-left: 2vh;
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 5px;
  overflow: hidden;
  transition: 0.3s ease;
}

.input-container:hover {
  border: 1px solid #f44949;
  transition: 0.3s ease;
}

.input-container:hover input,
.input-container:hover button {
  border: none;
}

.slider-container {
  width: 100%;
  padding: 20px;
  background-color: transparent;
  box-sizing: border-box;
}

.icon {
  height: 12px;
}

.disabled-icon {
  opacity: 0.5;
}

h2 {
  margin-bottom: 1vh;
  color: #ffffff;
}

input {
  background-color: #262730;
  color: #ffffff;
  text-align: center;
  height: 100%;
  width: 70px;
  margin: none;
  border: none;
}

button {
  background-color: #262730;
  height: 100%;
  width: 32px;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #f44949;
}

.disabled-button {
  cursor: not-allowed;
}

button:disabled:hover {
  background-color: #262730;
}
</style>