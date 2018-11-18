<template>
  <div class="canvas-history" v-if="SELECTED_CLIP">
    <el-card class="title-card" :body-style="{padding: '0.4rem'}">
      History
    </el-card>
    <div class="list">
      <el-card
        class="box-card"
        :body-style="{padding: '0.3rem'}"
        v-for="(data, i) in redoStack"
        :key="i"
        @click.native="jumpSvgElementHistory(i)"
      >
        {{data.type}}
      </el-card>
      <el-card
        class="box-card"
        :body-style="{padding: '0.3rem'}"
        v-for="(data, i) in undoStackReverse"
        :key="redoStack.length + i"
        :class="{current: !isOldest && i === 0}"
        @click.native="jumpSvgElementHistory(redoStack.length + i)"
      >
        {{data.type}}
      </el-card>
      <el-card
        class="box-card"
        :body-style="{padding: '0.3rem'}"
        :class="{current: isOldest}"
        @click.native="jumpSvgElementHistory(allHistory.length)"
      >
        Oldest
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import clipTypes from '@main/store/modules/clips/types'

export default {
  computed: {
    ...mapGetters({
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP
    }),
    undoStackReverse() {
      if (!this.SELECTED_CLIP) return []
      return this.SELECTED_CLIP.svgElementUndoStack.concat().reverse()
    },
    redoStack() {
      if (!this.SELECTED_CLIP) return []
      return this.SELECTED_CLIP.svgElementRedoStack
    },
    allHistory() {
      return [...this.redoStack, ...this.undoStackReverse]
    },
    isOldest() {
      return this.undoStackReverse.length === 0
    }
  },
  methods: {
    ...mapActions({
      _jumpSvgElementHistory: clipTypes.a.JUMP_SVG_ELEMENT_HISTORY
    }),
    jumpSvgElementHistory(to) {
      this._jumpSvgElementHistory({
        clipId: this.SELECTED_CLIP.id,
        to
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.canvas-history {
  height: 100%;
  border: 0.1rem solid gray;
  .list {
    overflow: auto;
    height: calc(100% - 3.2rem);
  }
  .title-card {
    font-size: 1.4rem;
  }
  .box-card {
    transition: 0.1s;
    cursor: pointer;
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
  }
}
</style>
