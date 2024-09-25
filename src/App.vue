<script setup>
import { ref } from 'vue';
import './assets/main.css';
import AddRows from './components/AddRows.vue';
import SelectBoxes from '@/components/SelectBoxes.vue'
import SelectRows from '@/components/SelectRows.vue'
import ShowTable from './components/ShowTable.vue';
import uploadButton from './components/uploadButton.vue';
import SelectSkill from './components/SelectSkill.vue';

const isTableVisible = ref(false);

const toggleTable = () => {
  isTableVisible.value = !isTableVisible.value;
}
</script>

<template>
<div class="page-layout">
  <nav>
    <uploadButton />
    <h1 class="nav-title">HBR Axle Tool</h1>
    <button @click="toggleTable"> 
      <img src="@/assets/custom_icon/table.svg" alt="table"> 
    </button>
    <ShowTable v-if="isTableVisible" @close="toggleTable"/>
  </nav>
  <main class="scrollbar-style-1">
    <div class="box_container"><SelectBoxes /></div>
      <div class="axle">
        <SelectRows />
        <SelectSkill />
        <AddRows />
      </div>
      <div class="footer">
        <div class="footer-content">
          Developed by 
          <a href="https://github.com/FuseFairy" target="_blank">Zhuang</a> & 
          <a href="https://github.com/Yuuzi261" target="_blank">Yuuzi</a>
        </div>
      </div>
  </main>
</div>
</template>

<style scoped>
.page-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: 
    "navbar"
    "main";
  background-color: black;
  background-image: url(@/assets/bg.webp);
  background-position: center;
  background-size: cover;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1001;
  height: 3rem;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  position: fixed;
  grid-area: navbar;
  background-color: rgb(21, 21, 23);
  color: white;
}
button {
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
button:hover {
  background-color: rgba(78, 69, 69, 0.3)
}
.nav-title {
  flex-grow: 1;
  text-align: center;
  font-size: 1.5rem;
}
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
.show {
  display: block;
  transform: translateX(0);
  animation: slideIn 0.3s ease forwards;
}
main {
  grid-area: main;
  color: white;
  margin-top: 3rem;
  overflow-y: scroll;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 1rem;
  height: calc(100vh - 3rem);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr;
  grid-template-areas: 
    "box_container"
    "axle"
    "footer";
}
.footer {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.footer-content {
  padding: 10px;
  font-size: 0.8rem;
  color: #808080;
}
.footer-content a {
  color: #808080;
  text-decoration: none;
}
.footer-content a:hover {
  text-decoration: underline;
  color: #606060;
}
.box_container{
  grid-area: box_container;
  margin: 10px;
  height: auto;
}
.axle{
  padding-top: 0.5rem;
  grid-area: axle;;
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
@media(max-width: 450px) {
  .box_container {
    height: 30vh;
  }
}
</style>