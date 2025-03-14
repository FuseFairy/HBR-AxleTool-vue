<script setup>
import AddRows from '@/components/ui/AddRowsButton.vue'
import RowSlider from '@/components/ui/RowSlider.vue'
import TurnSkillSelection from '@/layouts/TurnSkillSelection.vue'
import AxleNameInput from '@/components/ui/AxleNameInput.vue'
</script>

<template>
  <div class="form-row">
    <div class="left-column"><AxleNameInput /></div>
    <div class="right-column"><RowSlider /></div>
  </div>
  <TurnSkillSelection />
  <AddRows />
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
</style>