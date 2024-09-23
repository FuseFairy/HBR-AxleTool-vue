<template>
<div class="container">
	<button 
		@click="addRow"
		class="circle-button add-button"
		:disabled="sliderStore.rows === 50 || (sliderStore.rows === 0 && !hasChar)">
		<img class="icon-img" src="@/assets/custom_icon/add.svg" alt="Add a row" />
	</button>
</div>
</template>

<script setup>
import { computed, nextTick } from 'vue';
import { useSliderStore } from '@/stores/slider_stores';
import { useSkillStore } from '@/stores/skill_stores';
import { useCharStore } from '@/stores/char_stores';

const sliderStore = useSliderStore();
const skillStore = useSkillStore()
const charStore = useCharStore();

const addRow = () => {
  if (sliderStore.rows < 50) {
    sliderStore.rows++;
		skillStore.adjustSkills(sliderStore.rows)
		nextTick(() => {
      scrollToBottom();
    });
  }
};

const hasChar = computed(() => {
    return Object.values(charStore.selections).some(selection => 
    selection.character !== null && selection.style !== null
    );
});

const scrollToBottom = () => {
  const mainElement = document.querySelector('main.scrollbar-style-1');
  if (mainElement) {
    mainElement.scrollTo({
      top: mainElement.scrollHeight,
      behavior: 'smooth'
    });
  }
};
</script>
    
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
}

.circle-button {
  margin-top: 20px;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  aspect-ratio: 1 / 1;
  font-size: 16px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(79, 74, 74, 0.5);
}

.add-button {
  border: none;
  transition: background-color 0.3s ease;
}
.add-button:hover {
  background-color: rgba(204, 201, 201, 0.5);
}
.add-button:hover .icon-img {
	filter: invert(1);
}

.icon-img {
  width: 50px;
  height: 50px;
}

button:disabled {
  display: none;
}

@media (max-width: 800px) {
  .container {
    width: auto;
  }
  .circle-button {
    width: 60px;
    height: 60px;
    font-size: 14px;
  }
}
</style>