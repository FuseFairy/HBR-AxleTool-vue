<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useCharStore } from '@/stores/char_stores';
import { useSkillStore } from '@/stores/skill_stores';

const charStore = useCharStore();
const skillStore = useSkillStore();

const emit = defineEmits(['close']);
const closeTable = () => {
  emit('close');
};
</script>

<template>
  <div @click="closeTable" class="overlay">
    <div @click.stop class="container">
      <div class="table scrollbar-style-1">
        <button @click="closeTable" class="close"> 
          <img src="@/assets/custom_icon/close.svg" alt="Close">
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.close{
  background-color: transparent;
  padding: 1px;
  border: none;
  box-sizing: border-box;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
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
  padding: 1rem 0 1rem 1rem;
  border-radius: 20px;
}
.table {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-right: 2rem;
}
.scrollbar-style-1::-webkit-scrollbar {
    width: 5px;
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