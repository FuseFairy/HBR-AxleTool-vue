<script setup>
  import AddRows from '@/components/ui/AddRowsButton.vue'
  import RowSlider from '@/components/ui/RowSlider.vue'
  import TurnSkillSelection from '@/layouts/TurnSkillSelection.vue'
  import AxleNameInput from '@/components/ui/AxleNameInput.vue'
</script>

<template>
  <div class="form-row">
    <div class="left-column">
      <AxleNameInput />
    </div>
    <div class="right-column">
      <RowSlider />
    </div>
  </div>
  <TurnSkillSelection />
  <AddRows />
</template>

<style scoped>
  .form-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    flex-wrap: wrap;
    margin: var(--spacing-3) var(--spacing-5) 0 var(--spacing-5);
  }
  .left-column {
    flex: 2;
  }
  .right-column {
    flex: 3;
  }
  @media (max-width: 900px) {
    .form-row {
      flex-direction: column;
      align-items: stretch;
    }

    .left-column,
    .right-column {
      flex: unset;
      width: 100%;
    }
  }
</style>
