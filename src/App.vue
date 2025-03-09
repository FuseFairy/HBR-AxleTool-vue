<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import './assets/main.css'
import AddRows from '@/components/ui/AddRowsButton.vue'
import TeamComposition from '@/components/TeamComposition.vue'
import RowSlider from '@/components/ui/RowSlider.vue'
import TurnSkillSelection from '@/components/TurnSkillSelection.vue'
import AxleName from '@/components/ui/AxleNameInput.vue'
import Navbar from '@/components/Navbar.vue'
import { runIPGeolocation } from '@/utils/ipGeolocation'

onBeforeMount(runIPGeolocation);
</script>

<template>
  <div class="page-layout">
    <Navbar />
    <main class="scrollbar-style-1">
      <div class="box_container"><TeamComposition /></div>
      <div class="axle">
        <div class="form-row">
          <div class="left-column"><AxleName /></div>
          <div class="right-column"><RowSlider /></div>
        </div>
        <TurnSkillSelection />
        <AddRows />
      </div>
      <div class="footer">
        <div class="footer-content">
          <a href="https://github.com/FuseFairy/HBR-AxleTool-vue" target="_blank">
            <img src="@/assets/custom-icon/github.svg" alt="GitHub" class="github-icon" />
          </a>
          <div class="footer-text">
            Developed by <a href="https://github.com/FuseFairy" target="_blank">Zhuang</a> & <a href="https://github.com/Yuuzi261" target="_blank">Yuuzi</a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
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
  background-image: url(@/assets/common/bg.webp);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: -1;
  pointer-events: none;
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
