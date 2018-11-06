<template>
<ellipse
  :cx="cx"
  :cy="cy"
  :rx="absRx"
  :ry="absRy"
  :stroke="stroke"
  :stroke-width="strokeWidth"
  :stroke-opacity="strokeOpacity"
  :fill="fill"
  :fill-opacity="fillOpacity"
  :stroke-dasharray="strokeDasharray.join(' ')"
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
    rx: {
      type: Number,
      default: 0
    },
    ry: {
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
    fill: {
      type: String,
      default: 'none'
    },
    fillOpacity: {
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
  },
  computed: {
    absR() {
      return Math.abs(this.r) || 1
    },
    absRx() {
      if (this.rx === 0) return this.absR
      return Math.abs(this.rx) || 1
    },
    absRy() {
      if (this.ry === 0) return this.absR
      return Math.abs(this.ry) || 1
    }
  }
}
</script>
