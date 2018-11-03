<template>
<circle
  :cx="cx"
  :cy="cy"
  :r="absR"
  :stroke="stroke"
  :stroke-width="strokeWidth"
  :stroke-opacity="strokeOpacity"
  :fill="fill"
  :fill-opacity="fillOpacity"
  :stroke-dasharray="strokeDasharray"
  :stroke-dashoffset="strokeDashoffset"
/>
</template>

<script>
export default {
  props: {
    cx: {
      type: Number,
      default: 0
    },
    cy: {
      type: Number,
      default: 0
    },
    r: {
      type: Number,
      default: 1
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
    fill: {
      type: String,
      default: 'none'
    },
    fillOpacity: {
      type: Number,
      default: 1
    },
    strokeDasharray: {
      type: Number,
      default: 0
    },
    strokeDashoffset: {
      type: Number,
      default: 0
    }
  },
  computed: {
    absR() {
      return Math.abs(this.r) || 1
    }
  }
}
</script>
