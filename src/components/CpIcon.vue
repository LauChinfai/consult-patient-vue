<script lang="ts" setup>
defineProps<{
  name: string
}>()
</script>
<template>
  <svg aria-hidden="true" class="cpIcon">
    <use :href="`#icon-${name}`"></use>
  </svg>
</template>
<style scoped lang="scss">
.cpIcon {
  width: 1em;
  height: 1em;
}
</style>
