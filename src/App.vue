<script setup>
import { ref } from 'vue'
import './assets/main.css'
import AddRows from '@/components/AddRows.vue'
import SelectBoxes from '@/components/SelectBoxes.vue'
import SelectRows from '@/components/SelectRows.vue'
import ShowTable from '@/components/ShowTable.vue'
import uploadButton from '@/components/uploadButton.vue'
import SelectSkill from '@/components/SelectSkill.vue'
import AxleName from '@/components/AxleName.vue'

const isTableVisible = ref(false)

const toggleTable = () => {
  isTableVisible.value = !isTableVisible.value
}
</script>

<template>
  <div class="page-layout">
    <nav>
      <uploadButton />
      <h1 class="nav-title">HBR Axle Tool</h1>
      <button @click="toggleTable">
        <img src="@/assets/custom_icon/table.svg" alt="table" />
      </button>
      <Transition name="modal">
        <ShowTable v-if="isTableVisible" @close="toggleTable" />
      </Transition>
    </nav>
    <main class="scrollbar-style-1">
      <div class="box_container"><SelectBoxes /></div>
      <div class="axle">
        <div class="form-row">
          <div class="left-column"><AxleName /></div>
          <div class="right-column"><SelectRows /></div>
        </div>
        <SelectSkill />
        <AddRows />
      </div>
      <div class="footer">
        <div class="footer-content">
          <a href="https://github.com/FuseFairy/HBR-AxleTool-vue" target="_blank">
            <img src="@/assets/custom_icon/github.svg" alt="GitHub" class="github-icon" />
          </a>
          <div class="footer-text">
            <p>Developed by </p>
            <a href="https://github.com/FuseFairy" target="_blank">Zhuang</a>
            <p> & </p>
            <a href="https://github.com/Yuuzi261" target="_blank">Yuuzi</a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* .box_container, .axle, .footer {
  border: 1px solid red;
} */
.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin: 10px 20px 0 20px;
}
.left-column {
  flex: 1;
}
.right-column {
  flex: 3;
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from {
  transform: scale(0.8);
  opacity: 0;
}
.modal-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
.page-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'navbar'
    'main';
  background-color: black;
  position: relative;
  z-index: 0;
  overflow: hidden;
}
.page-layout::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(@/assets/bg.webp);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: -1;
  pointer-events: none;
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
  background-color: rgba(78, 69, 69, 0.3);
}
.nav-title {
  flex-grow: 1;
  text-align: center;
  font-family: 'Gugi', 'Noto Sans TC', sans-serif;
  color: rgb(210, 203, 208);
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
    'box_container'
    'axle'
    'footer';
}
.footer {
  grid-area: footer;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.footer-content {
  padding: 10px;
  font-size: 0.8rem;
  color: #808080;
  display: flex;
  align-items: center;
}
.footer-content a {
  color: #808080;
  text-decoration: none;
  display: flex;
  align-items: center;
  height: 20px;
}
.footer-content a:hover {
  text-decoration: underline;
  color: #606060;
}
.footer-text > p,
.footer-text > a {
  display: inline;
}
.github-icon {
  width: 20px;
  height: 20px;
  margin-right: 4px;
  filter: invert(1) brightness(0.5);
}
.box_container {
  grid-area: box_container;
  margin: 10px;
}
.axle {
  grid-area: axle;
  padding-top: 0.5rem;
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
@media (max-width: 800px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  .right-column {
    flex: unset;
    width: 100%;
  }
  .left-column {
    flex: unset;
    width: 100%;
  }
}
</style>
