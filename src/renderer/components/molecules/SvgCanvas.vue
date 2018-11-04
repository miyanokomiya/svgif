<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    font-family="sans-serif"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
  >
    <slot/>
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
