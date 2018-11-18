<template>
  <el-card
    class="box-card"
    :body-style="{padding: '0.3rem'}"
    :class="{ current }"
  >
    <div class="history-item">
      <span class="type">{{label}}</span><span v-if="count" class="count">({{count}})</span>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    },
    current: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  text-align: left;
  transition: 0.1s;
  cursor: pointer;
  user-select: none;
  &:first-child {
    border-top: 0.1rem solid gray;
  }
  &:last-child {
    border-bottom: 0.1rem solid gray;
  }
  &:nth-child(odd) {
    background-color: #eee;
  }
  &:hover {
    background-color: #409eff;
    color: #fff;
  }
  &.current {
    background-color: #67c23a;
    color: #fff;
    cursor: auto;
  }
  .history-item {
    display: flex;
    align-items: center;
    padding: 0 3rem;
    .type {
      font-size: 1rem;
    }
    .count {
      margin-left: auto;
      font-size: 1rem;
    }
  }
}
</style>
