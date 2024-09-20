<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import Multiselect from '@vueform/multiselect'
import { useCharStore } from '@/stores/char_stores'
import { fetchCharacterOptions } from '@/api/charData';
import { fetchStyleOptions } from '@/api/styleData';

const charStore = useCharStore();

const props = defineProps({
  buttonKey: {
    type: Number,
    required: true,
  },
});

const teamOptions = [
  { value: '30G', name: '30G', icon: '/src/assets/team_icon/30G.webp' },
  { value: '31A', name: '31A', icon: '/src/assets/team_icon/31A.webp' },
  { value: '31B', name: '31B', icon: '/src/assets/team_icon/31B.webp' },
  { value: '31C', name: '31C', icon: '/src/assets/team_icon/31C.webp' },
  { value: '31D', name: '31D', icon: '/src/assets/team_icon/31D.webp' },
  { value: '31E', name: '31E', icon: '/src/assets/team_icon/31E.webp' },
  { value: '31F', name: '31F', icon: '/src/assets/team_icon/31F.webp' },
  { value: '31X', name: '31X', icon: '/src/assets/team_icon/31X.webp' },
  { value: 'Angel beats!', name: 'Angel Beats!', icon: '/src/assets/team_icon/Angel Beats!.webp' }
];
const characterOptions = ref([]);
const styleOptions = ref([]);

const selectedTeam = ref(charStore.getSelection(props.buttonKey, 'team'));
const selectedCharacter = ref(charStore.getSelection(props.buttonKey, 'character'));
const selectedStyle = ref(charStore.getSelection(props.buttonKey, 'style'));

const isCharDisabled = computed(() => !selectedTeam.value);
const isStyleDisabled = computed(() => !selectedCharacter.value);

const initializeOptions = async () => {
  if (selectedTeam.value) {
    characterOptions.value = await fetchCharacterOptions(selectedTeam.value);
  }
  if (selectedCharacter.value) {
    styleOptions.value = await fetchStyleOptions(selectedCharacter.value, selectedTeam.value);
  }
};

onMounted(initializeOptions);

watch(selectedTeam, async (newTeam) => {
  charStore.setSelection(props.buttonKey, 'team', newTeam);
  if (newTeam) {
    characterOptions.value = await fetchCharacterOptions(newTeam);
    selectedCharacter.value = null;
    selectedStyle.value = null;
  } else {
    characterOptions.value = [];
    selectedCharacter.value = null;
    selectedStyle.value = null;
  }
});

watch(selectedCharacter, async (newChar) => {
  charStore.setSelection(props.buttonKey, 'character', newChar);
  if (newChar) {
    styleOptions.value = await fetchStyleOptions(newChar, selectedTeam.value);
    selectedStyle.value = null;
  } else {
    styleOptions.value = [];
    selectedStyle.value = null;
  }
});

watch(selectedStyle, (newStyle) => {
  if (newStyle) {
    const selectedOption = styleOptions.value.find(option => option.name === newStyle);
    if (selectedOption) {
      charStore.setSelection(props.buttonKey, 'style', newStyle);
      charStore.setSelection(props.buttonKey, 'img', selectedOption.icon);
    }
  } else {
      charStore.setSelection(props.buttonKey, 'style', null);
      charStore.setSelection(props.buttonKey, 'img', null);
    }
});

const emit = defineEmits(['close']);
const closeContainer = () => {
  emit('close');
};
</script>

<template>
  <div @click="closeContainer" class="overlay">
    <div @click.stop class="container">
      <button @click="closeContainer" class="close"> 
        <img src="@/assets/custom_icon/close.svg" alt="Close">
      </button>
      <div class="section">
        <label>Team</label>
        <Multiselect
          v-model="selectedTeam"
          placeholder="Select team"
          label="name"
          :options="teamOptions">
          <template v-slot:singlelabel="{ value }">
            <div class="multiselect-single-label">
              <img class="label-icon" :src="value.icon">
              <span :title="value.name">{{ value.name }}</span>
            </div>
          </template>

          <template v-slot:option="{ option }">
            <img class="option-icon" :src="option.icon">
            <span :title="option.name">{{ option.name }}</span>
          </template>
        </Multiselect>
      </div>

      <div class="section">
        <label>Character</label>
        <Multiselect
          v-model="selectedCharacter"
          placeholder="Select character"
          label="name"
          :disabled="isCharDisabled"
          :options="characterOptions">
          <template v-slot:singlelabel="{ value }">
            <div class="multiselect-single-label">
              <img class="label-icon" :src="value.icon"> 
              <span :title="value.name">{{ value.name }}</span>
            </div>
          </template>

          <template v-slot:option="{ option }">
            <img class="option-icon" :src="option.icon"> 
            <span :title="option.name">{{ option.name }}</span>
          </template>
        </Multiselect>
      </div>

      <div class="section">
        <label>Style</label>
        <Multiselect
          v-model="selectedStyle"
          placeholder="Select style"
          label="name"
          :disabled="isStyleDisabled"
          :options="styleOptions">
          <template v-slot:singlelabel="{ value }">
            <div class="multiselect-single-label">
              <img class="label-icon" :src="value.icon">
              <span :title="value.name">{{ value.name }}</span>
            </div>
          </template>

          <template v-slot:option="{ option }">
            <img class="option-icon" :src="option.icon">
            <span :title="option.name">{{ option.name }}</span>
          </template>
        </Multiselect>
      </div>
    </div>
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css" />
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
span{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  justify-content: center;
  align-items: center;
}
.section{
  padding-top: 1.5rem;
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
  height: 50vh;
  width: 31%;
  box-sizing: border-box;
  padding: 1rem;
  border-radius: 20px;
}
.option-icon,
.label-icon{
  width: 32px;
  height: 32px;
}
:deep(.multiselect-option),
.multiselect-single-label{
  display: flex;
  gap: 0.5rem;
}
:deep(.multiselect){
  background-color: black;
  border: 1px solid rgb(64, 68, 141);
}
:deep(.multiselect.is-active){
  box-shadow: none;
}
:deep(.multiselect-dropdown){
  background-color: black;
  border: 1px solid rgb(64, 68, 141);
}
:deep(.multiselect-dropdown::-webkit-scrollbar){
  width: 5px;
}
:deep(.multiselect-dropdown::-webkit-scrollbar-track),
:deep(.multiselect-dropdown::-webkit-scrollbar-thumb) {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
:deep(.multiselect-dropdown::-webkit-scrollbar-thumb) {
    background-color: #555;
}
:deep(.multiselect-option.is-selected){
  background-color: rgb(60, 57, 57);
}
:deep(.multiselect-option.is-pointed){
  background-color: rgb(160, 160, 167);
  color: rgb(0, 0, 0);
}
:deep(.multiselect-caret){
  margin-left: 14px;
}
:deep(.multiselect-clear){
  padding: 0;
}
:deep(.multiselect-clear-icon:hover),
:deep(.multiselect-clear-icon:active),
:deep(.multiselect-clear-icon:focus) {
    background-color: #999;
}
@media(max-width: 800px) {
  .container{
    width: 90%;
  }
}
</style>