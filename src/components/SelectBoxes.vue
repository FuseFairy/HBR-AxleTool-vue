<script setup>
import { ref } from 'vue';
import SidebarSelect from '@/components/SelectChar.vue';

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
</script>

<template>
  <div class="button-container">
    <button
      v-for="button in buttons"
      :key="button.key"
      @click="handleBoxClick(button.key)"
      class="circle-button">
			<img class="add_icon" src="@/assets/custom_icon/add.svg" alt="Add"> 
    </button>
  </div>
  <SidebarSelect v-if="activeComponent !== null" :buttonKey="activeComponent" />
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
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: none;
  background-color: rgba(79, 74, 74, 0.5);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}
.circle-button:hover {
  background-color: rgba(204, 201, 201, 0.5);
}
.circle-button:hover .add_icon{
	filter: invert(1);
}
@media (max-width: 800px) {
  .circle-button {
    width: 70px;
    height: 70px;
    font-size: 14px;
  }
}

@media (max-width: 400px) {
  .circle-button {
    width: 60px;
    height: 60px;
    font-size: 12px;
  }
}
</style>
