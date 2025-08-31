<script setup>
  import { onBeforeMount, onMounted } from 'vue'
  import { runIPGeolocation } from '@/utils/browser/ipGeolocation'
  import { getData } from '@/utils/axle/axleDataApi'
  import { decompressAxleData } from '@/utils/axle/decompressAxleData'
  import { loadFontCSS } from '@/utils/browser/loadFontCSS'
  import { getAssetsFile } from '@/utils/assets/getAssetsFile'
  import { useSkillStore } from '@/store/axle'
  import { useSidebarStore } from '@/store/sidebar'
  import { useScrollbarStore } from '@/store/scrollbar'
  import TeamComposition from '@/layouts/TeamComposition.vue'
  import Navbar from '@/layouts/Navbar.vue'
  import AppFooter from '@/layouts/Footer.vue'
  import AxleSection from '@/layouts/AxleSection.vue'
  import '@/style/main.css'
  import NProgress from 'nprogress'
  import '@/style/nprogress/nprogress.css'
  import BackToTopButton from '@/components/ui/BackToTopButton.vue'
  import Sidebar from '@/layouts/Sidebar.vue'
  import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
  import { scrollbarOptions } from '@/config/scrollbarConfig.js'

  const sidebarStore = useSidebarStore()
  const scrollbarStore = useScrollbarStore()

  const handleScroll = (instance) => {
    const { scrollOffsetElement } = instance.elements()
    scrollbarStore.topOffset = scrollOffsetElement.scrollTop
  }

  const onScrollbarInitialized = (instance) => {
    scrollbarStore.instance = instance
  }

  const scrollbarEvents = {
    initialized: onScrollbarInitialized,
    scroll: handleScroll,
  }

  onBeforeMount(runIPGeolocation)
  onMounted(async () => {
    NProgress.configure({ showSpinner: false })
    NProgress.start()
    try {
      const skillStore = useSkillStore()
      skillStore.ensureIds()

      const fonts = [
        'fonts/LXGWWenKaiMonoTC-Regular/result.css',
        'fonts/Gugi-Regular/result.css',
        'fonts/Xiaolai-Regular/result.css',
      ]

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
            if (data != null || data != undefined) await decompressAxleData(data)
            else alert('ERROR: Wrong Url!')
            window.history.replaceState({}, document.title, '/')
          } catch (error) {
            alert(error)
            throw error
          }
        })(),
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
  <div class="page-layout" :class="{ 'sidebar-open': sidebarStore.isSidebarOpen }">
    <Navbar />
    <Sidebar />
    <main>
      <OverlayScrollbarsComponent
        class="overlayscrollbars-vue"
        :options="scrollbarOptions"
        :events="scrollbarEvents"
        defer>
        <div class="main-content-wrapper">
          <div class="box_container">
            <TeamComposition />
          </div>
          <div class="axle">
            <AxleSection />
          </div>
          <div class="footer">
            <AppFooter />
          </div>

          <BackToTopButton />
        </div>
      </OverlayScrollbarsComponent>
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

  main {
    grid-area: main;
    margin-top: 3rem;
    height: calc(100vh - 3rem);
    transition: margin-left 0.3s ease-in-out;
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15px);
    mask-image: linear-gradient(to bottom, transparent 0%, black 15px);
  }

  .main-content-wrapper {
    color: white;
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    grid-template-areas:
      'box_container'
      'axle'
      'footer';
  }

  .page-layout.sidebar-open main {
    margin-left: max(20%, 250px);
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

  @media (max-width: 900px) {
    .page-layout.sidebar-open main {
      margin-left: 0;
      width: 100%;
    }
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
