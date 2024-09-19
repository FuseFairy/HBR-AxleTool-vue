<template>
<div class="slider-container">
	<h2>{{ title }}</h2>
	<vue-slider 
		v-model="sliderStore.rows"
		:min="0"
		:max="50"
		:interval="1"
		:contained="true"
		:lazy="true"
		:drag-on-click="true"
		:marks="[0, 50]"
		@change="sliderStore.setValue">
	</vue-slider>
</div>
</template>

<script setup>
import { useSliderStore } from '@/stores/slider_stores';
import VueSlider from 'vue-slider-component'
import '/styles/themes/slider.css'

const title = 'Number Of Rows';
const sliderStore = useSliderStore();
</script>

<style scoped>
.slider-container {
    width: 100%;
    padding: 20px;
    background-color: transparent;
    box-sizing: border-box;
}

h2 {
    margin: 0 0 10px 0;
    color: #ffffff;
}
</style>