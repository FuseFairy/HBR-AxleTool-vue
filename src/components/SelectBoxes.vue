<script setup>
import { ref, onMounted } from 'vue';
import { useCharStore } from '@/stores/char_stores';
import SidebarSelect from '@/components/SelectChar.vue';

const charStore = useCharStore();

const buttons = ref([
  { key: 1, label: 'Button 1' },
  { key: 2, label: 'Button 2' },
  { key: 3, label: 'Button 3' },
  { key: 4, label: 'Button 4' },
  { key: 5, label: 'Button 5' },
  { key: 6, label: 'Button 6' },
]);

const activeComponent = ref(null);
const handleBoxClick = (key) => {
  activeComponent.value = key;
};

const closeContainer = () => {
  activeComponent.value = null;
};
</script>

<template>
<div class="button-container">
  <button
    v-for="button in buttons"
    :key="button.key"
    @click="handleBoxClick(button.key)"
    :class="{
      'circle-button selected-button': charStore.selections[button.key].img !== null,
      'circle-button add-button': charStore.selections[button.key].img === null
    }">
    <img v-if="charStore.selections[button.key].img !== null" 
         class="char-img" 
         :src="charStore.selections[button.key].img" 
         :alt="charStore.selections[button.key].style">
    <img v-else 
         class="icon-img" 
         src="@/assets/custom_icon/add.svg" 
         alt="Add">
  </button>
</div>
  <SidebarSelect v-if="activeComponent !== null" :buttonKey="activeComponent" @close="closeContainer" />
</template>

<style scoped>
.button-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 20px;
  justify-items: center;
  align-items: center;
  height: 100%;
}
.circle-button {
  border-radius: 50%;
  width: 120px;
  height: 120px;
  aspect-ratio: 1 / 1;
  font-size: 16px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(79, 74, 74, 0.5);
}
.selected-button {
  border: none;
  transition: transform 0.3s ease;
  box-shadow: 0 0 10px rgba(188, 115, 194, 0.8);
}
.selected-button:hover{
  box-shadow: 0 0 15px rgba(188, 115, 194, 0.8);
}
.selected-button:hover .char-img {
  transform: scale(1.1);
}
.char-img{
  transition: transform 0.3s ease;
  width: 100%;
  height: 100%;
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
@media (max-width: 800px) {
  .button-container {
    grid-template-columns: repeat(3, 1fr);
  }
  .circle-button {
    width: 100px;
    height: 100px;
    font-size: 14px;
  }
}
@media (max-width: 390px) {
  .circle-button {
    width: 80px;
    height: 80px;
    font-size: 12px;
  }
}
</style>
