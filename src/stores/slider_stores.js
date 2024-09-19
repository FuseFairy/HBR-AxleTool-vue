import { defineStore } from 'pinia';

export const useSliderStore = defineStore('slider', {
  state: () => ({
    value: 0,
  }),
  actions: {
    setValue(newValue) {
      this.value = newValue;
    },
  },
});