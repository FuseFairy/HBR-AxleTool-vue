<script setup>
  import { getAssetsFile } from '@/utils/assets/getAssetsFile'
  import { useUiStore } from '@/store/ui'

  const uiStore = useUiStore()

  const scrollToTop = () => {
    const osInstance = uiStore.scrollbarInstance
    const { scrollOffsetElement } = osInstance.elements()

    scrollOffsetElement.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }
</script>

<template>
  <transition name="fade">
    <button v-if="uiStore.scrollbarTopOffset > 500" class="back-to-top" @click="scrollToTop">
      <img :src="getAssetsFile('custom-icon/arrow_up.svg')" alt="Back to Top" />
    </button>
  </transition>
</template>

<style scoped>
  .back-to-top {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(40, 40, 40, 0.85));
    color: #e5e5e5;
    border: 3px solid rgba(100, 100, 100, 0.3);
    border-radius: 50%;
    width: 56px;
    height: 56px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .back-to-top::before {
    content: '';
    position: absolute;
    inset: 0;
    backdrop-filter: blur(8px) saturate(180%);
    background: rgba(15, 15, 15, 0.1);
    z-index: -1;
    border-radius: inherit;
  }

  .back-to-top:hover {
    background: linear-gradient(135deg, rgba(50, 50, 50, 0.95), rgba(70, 70, 70, 0.9));
    transform: translateY(-2px) scale(1.05);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.7),
      0 4px 16px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    border-color: rgba(150, 150, 150, 0.4);
  }

  .back-to-top:active {
    transform: translateY(0) scale(0.98);
    transition: transform 0.1s ease;
  }

  .back-to-top img {
    width: 24px;
    height: 24px;
    filter: brightness(1.1) contrast(1.1);
    transition: all 0.3s ease;
    z-index: 2;
  }

  .back-to-top:hover img {
    filter: brightness(1.3) contrast(1.2);
    transform: translateY(-1px);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .fade-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }

  .fade-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.9);
  }

  @media (max-width: 900px) {
    .back-to-top {
      width: 48px;
      height: 48px;
      bottom: 20px;
      right: 20px;
    }

    .back-to-top img {
      width: 20px;
      height: 20px;
    }
  }
</style>
