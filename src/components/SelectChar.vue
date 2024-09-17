<script setup>
import { ref, watch} from 'vue'
import Multiselect from '@vueform/multiselect'
import { useCharStore } from '@/stores/char_stores'
import { fetchCharacterOptions } from '@/api/charData';
import { fetchStyleOptions } from '@/api/styleData';

const charStore = useCharStore()

const props = defineProps({
  buttonKey: {
    type: Number,
    required: true,
  },
});

const team_options = [
  {value: '30G', name: '30G', icon: '/src/assets/team_icon/30G.webp'},
  {value: '31A', name: '31A', icon: '/src/assets/team_icon/31A.webp'},
  {value: '31B', name: '31B', icon: '/src/assets/team_icon/31B.webp'},
  {value: '31C', name: '31C', icon: '/src/assets/team_icon/31C.webp'},
  {value: '31D', name: '31D', icon: '/src/assets/team_icon/31D.webp'},
  {value: '31E', name: '31E', icon: '/src/assets/team_icon/31E.webp'},
  {value: '31F', name: '31F', icon: '/src/assets/team_icon/31F.webp'},
  {value: '31X', name: '31X', icon: '/src/assets/team_icon/31X.webp'},
  {value: 'Angel beats!', name: 'Angel Beats!', icon: '/src/assets/team_icon/Angel Beats!.webp'}
];

const character_options = ref([]);
const style_options = ref([]);
const disabled_char = ref(true)
const disabled_style = ref(true)

const selectedTeam = ref(charStore.getSelection(props.buttonKey, 'team'))
const selectedCharacter = ref(charStore.getSelection(props.buttonKey, 'character'))
const selectedStyle = ref(charStore.getSelection(props.buttonKey, 'style'))

watch(selectedTeam, async (newTeam) => {
  charStore.setSelection(props.buttonKey, 'team', newTeam)
  if (newTeam) {
    character_options.value = await fetchCharacterOptions(newTeam);
    selectedCharacter.value = null
    selectedStyle.value = null
    disabled_char.value = false
  } else {
    character_options.value = [];
    selectedCharacter.value = null
    selectedStyle.value = null
    disabled_char.value = true
    disabled_style.value = true
  }
});

watch(selectedCharacter, async (newChar) => {
  charStore.setSelection(props.buttonKey, 'character', newChar)
  if (newChar) {
    style_options.value = await fetchStyleOptions(newChar, selectedTeam.value);
    selectedStyle.value = null
    disabled_style.value = false
  } else {
    style_options.value = []
    selectedStyle.value = null
    disabled_style.value = true
  }
});

watch(selectedStyle, (newStyle) => {
  charStore.setSelection(props.buttonKey, 'style', newStyle)
  console.log(charStore.selections)
});
</script>

<template>
  <div class="container">
    <div class="section">
      <label>Team</label>
      <Multiselect
        v-model="selectedTeam"
        placeholder="Select team"
        label="name"
        :options="team_options">
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
        :disabled="disabled_char"
        :options="character_options">
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
        :disabled="disabled_style"
        :options="style_options">
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
</template>

<style src="@vueform/multiselect/themes/default.css" />
<style scoped>
span{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

</style>