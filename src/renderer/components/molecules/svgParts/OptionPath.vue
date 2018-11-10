<template>
  <path
    :d="d"
    stroke="black"
    :stroke-width="htmlToSvg(1)"
    :stroke-dasharray="`${htmlToSvg(1)}, ${htmlToSvg(5)}`"
    fill="none"
  />
</template>

<script>
import scaleConverter from '@/commons/mixins/scaleConverter'

export default {
  mixins: [scaleConverter],
  props: {
    d: {
      type: String,
      required: true
    },
    scale: {
      type: Number,
      default: 1
    }
  }
}
</script>
