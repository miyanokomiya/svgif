<template>
<g>
  <path
    :d="arrowPath"
    stroke="none"
    :fill="stroke"
    :fill-opacity="strokeOpacity"
  />
</g>
</template>

<script>
import SvgLine from './SvgLine'
import * as geo from '@/commons/utils/geo'

export default {
  extends: SvgLine,
  props: {
    radius2: {
      type: Number,
      default: 0
    },
    depth2: {
      type: Number,
      default: 0
    }
  },
  computed: {
    from() {
      return {
        x: this.x1,
        y: this.y1
      }
    },
    to() {
      return {
        x: this.x2,
        y: this.y2
      }
    },
    distance() {
      return geo.distance(this.from, this.to)
    },
    radian() {
      return geo.getRadian(this.from, this.to)
    },
    unitCross() {
      return geo.crossVector(this.unitVector)
    },
    unitVector() {
      return geo.unitVector(this.from, this.to)
    },
    p1() {
      return {
        x: this.x1 + (this.unitCross.x * this.strokeWidth) / 2,
        y: this.y1 + (this.unitCross.y * this.strokeWidth) / 2
      }
    },
    p2() {
      return {
        x: this.p1.x + this.unitVector.x * (this.distance - this.depth2),
        y: this.p1.y + this.unitVector.y * (this.distance - this.depth2)
      }
    },
    p3() {
      return {
        x: this.p2.x + this.unitCross.x * (this.radius2 + this.strokeWidth / 2),
        y: this.p2.y + this.unitCross.y * (this.radius2 + this.strokeWidth / 2)
      }
    },
    p4() {
      return {
        x: this.x2,
        y: this.y2
      }
    },
    p5() {
      return {
        x: this.p6.x - this.unitCross.x * (this.radius2 + this.strokeWidth / 2),
        y: this.p6.y - this.unitCross.y * (this.radius2 + this.strokeWidth / 2)
      }
    },
    p6() {
      return {
        x: this.p7.x + this.unitVector.x * (this.distance - this.depth2),
        y: this.p7.y + this.unitVector.y * (this.distance - this.depth2)
      }
    },
    p7() {
      return {
        x: this.x1 - (this.unitCross.x * this.strokeWidth) / 2,
        y: this.y1 - (this.unitCross.y * this.strokeWidth) / 2
      }
    },
    arrowPath() {
      return [this.p2, this.p3, this.p4, this.p5, this.p6, this.p7].reduce(
        (d, p) => {
          return ` ${d} L ${p.x} ${p.y}`
        },
        `M ${this.p1.x} ${this.p1.y}` + 'z'
      )
    }
  }
}
</script>
