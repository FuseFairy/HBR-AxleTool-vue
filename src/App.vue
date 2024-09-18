<script setup>
import { ref, onMounted } from 'vue';
import './assets/main.css';
import SelectBoxes from '@/components/SelectBoxes.vue'
import menuIcon from '@/assets/custom_icon/menu.svg';
import closeIcon from '@/assets/custom_icon/close.svg';

const isSidebarVisible = ref(false);
const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

const getIconSrc = () => {
  return isSidebarVisible.value ? closeIcon : menuIcon;
};
</script>

<template>
  <div class="page-layout" :class="{ 'sidebar-hidden': !isSidebarVisible }">
    <nav>
      <button @click="toggleSidebar"> 
        <img :src="getIconSrc()" alt="Menu"> 
      </button>
      <h1 class="nav-title">HBR Axle Tool</h1>
      <button class="setting"> 
        <img src="@/assets/custom_icon/setting.svg" alt="Setting"> 
      </button>
    </nav>
    <aside :class="{ show: isSidebarVisible }">
    </aside>
    <main class="scrollbar-style-1">
      <div class="box_container"><SelectBoxes /></div>
      <div class="axle">axle</div>
    </main>
  </div>
</template>

<style scoped>
.page-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: 
    "navbar navbar"
    "sidebar main";
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
  border: none;
  font-size: 1rem;
  height: 24px;
  cursor: pointer;
}
.nav-title {
  flex-grow: 1;
  text-align: center;
  font-size: 1.5rem;
}
.settings {
  margin-left: auto;
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
aside {
  height: calc(100vh - 3rem);
  top: 3rem;
  padding: 1rem;
  box-sizing: border-box;
  position: fixed;
  align-self: start;
  width: 250px;
  grid-area: sidebar;
  background-color: rgb(37, 33, 33);
  color: white;
  display: none;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}
.show {
  display: block;
  transform: translateX(0);
  animation: slideIn 0.3s ease forwards;
}
.sidebar-hidden {
  grid-template-columns: 0 1fr;
}
.page-layout.sidebar-hidden aside {
  transform: translateX(-100%);
  animation: slideOut 0.3s ease forwards;
}
main {
  grid-area: main;
  color: white;
  margin-top: 3rem;
  overflow-y: scroll;
  box-sizing: border-box;
  padding: 1rem;
  height: calc(100vh - 3rem);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: 
    "box_container"
    "axle";
}
.box_container{
  grid-area: box_container;
  margin: 10px;
  height: 20vh;
}
.axle{
  padding-top: 0.5rem;
  grid-area: axle;;
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
@media(max-width: 800px) {
  .page-layout {
    grid-template-columns: 0 1fr;
  }
  aside {
    width: 100%;
  }
}
@media(max-width: 450px) {
  .box_container {
    height: 30vh;
  }
}
</style>
