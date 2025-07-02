<script setup>
  import { onBeforeMount, onMounted } from 'vue'
  import { runIPGeolocation } from '@/utils/ipGeolocation'
  import { getData } from '@/utils/axleDataApi'
  import { updateData } from '@/utils/decompressData'
  import { loadFontCSS } from '@/utils/loadFontCSS'
  import { getAssetsFile } from '@/utils/getAssetsFile'
  import { useSkillStore } from '@/store/axle'
  import TeamComposition from '@/layouts/TeamComposition.vue'
  import Navbar from '@/layouts/Navbar.vue'
  import AppFooter from '@/layouts/Footer.vue'
  import AxleSection from '@/layouts/AxleSection.vue'
  import '@/style/main.css'
  import NProgress from 'nprogress'
  import '@/style/nprogress/nprogress.css'

  onBeforeMount(runIPGeolocation)
  onMounted(async () => {
    NProgress.configure({ showSpinner: false })
    NProgress.start()
    try {
      const skillStore = useSkillStore()
      skillStore.ensureIds()

      const fonts = ['fonts/LXGWWenKaiMonoTC-Regular/result.css', 'fonts/Gugi-Regular/result.css']

      await Promise.all(fonts.map((path) => loadFontCSS(getAssetsFile(path))))
    } catch (err) {
      console.error('ERROR:', err)
    }
    const params = new URLSearchParams(window.location.search)
    const axle_id = params.get('axle_id')
    const promisesToTrack = []

    if (axle_id) {
      promisesToTrack.push(
        (async () => {
          try {
            const response = await getData(axle_id)
            const result = await response.json()
            const { data } = result
            if (data != null || data != undefined) await updateData(data)
            else alert('ERROR: Wrong Url!')
            window.history.replaceState({}, document.title, '/')
          } catch (error) {
            alert(error)
            throw error
          }
        })()
      )
    }

    try {
      await Promise.all(promisesToTrack)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      NProgress.done()
    }
  })
</script>

<template>
  <div class="page-layout">
    <Navbar />
    <main class="scrollbar-style-1">
      <div class="box_container">
        <TeamComposition />
      </div>
      <div class="axle">
        <AxleSection />
      </div>
      <div class="footer">
        <AppFooter />
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
    background-image: url(@/assets/common/bg.webp), url(@/assets/common/bg_compress.webp);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: -1;
    pointer-events: none;
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
