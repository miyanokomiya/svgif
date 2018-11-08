<template>
<line
  :x1="x1"
  :y1="y1"
  :x2="x2"
  :y2="y2"
  :stroke="stroke"
  :stroke-width="strokeWidth"
  :stroke-opacity="strokeOpacity"
  :stroke-dasharray="strokeDasharray.join(' ')"
  :stroke-dashoffset="strokeDashoffset"
/>
</template>

<script>
export default {
  props: {
    x1: {
      type: Number,
      default: 0
    },
    y1: {
      type: Number,
      default: 0
    },
    x2: {
      type: Number,
      default: 0
    },
    y2: {
      type: Number,
      default: 0
    },
    strokeWidth: {
      type: Number,
      default: 1
    },
    stroke: {
      type: String,
      default: 'black'
    },
    strokeOpacity: {
      type: Number,
      default: 1
    },
    strokeDasharray: {
      type: Array,
      default: () => []
    },
    strokeDashoffset: {
      type: Number,
      default: 0
    }
  }
}
</script>
