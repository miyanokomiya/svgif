<template>
  <div
    v-if="SELECTED_CLIP"
    class="canvas-history"
  >
    <el-card class="title-card" :body-style="{padding: '0.4rem'}">
      <div class="title-block">
        <i v-if="isExistHistory" class="el-icon-delete" @click="cleaeSvgElementHistory" />
        <i v-else />
        <span>History</span>
      </div>
    </el-card>
    <div
      class="list"
      tabindex="-1"
      @keydown.90.ctrl.exact="undoSvgElement"
      @keydown.90.meta.exact="undoSvgElement"
      @keydown.90.ctrl.shift.exact="redoSvgElement"
      @keydown.90.meta.shift.exact="redoSvgElement"
    >
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
    },
    isExistHistory() {
      return this.allHistory.length > 0
    }
  },
  methods: {
    ...mapActions({
      _jumpSvgElementHistory: clipTypes.a.JUMP_SVG_ELEMENT_HISTORY,
      _cleaeSvgElementHistory: clipTypes.a.CLEAR_SVG_ELEMENT_HISTORY,
      _undoSvgElement: clipTypes.a.UNDO_SVG_ELEMENT,
      _redoSvgElement: clipTypes.a.REDO_SVG_ELEMENT
    }),
    jumpSvgElementHistory(to) {
      this.$svgif.selectedElementIdList = []
      this._jumpSvgElementHistory({
        clipId: this.SELECTED_CLIP.id,
        to
      })
    },
    undoSvgElement() {
      this.$svgif.selectedElementIdList = []
      this._undoSvgElement({ clipId: this.SELECTED_CLIP.id })
    },
    redoSvgElement() {
      this.$svgif.selectedElementIdList = []
      this._redoSvgElement({ clipId: this.SELECTED_CLIP.id })
    },
    cleaeSvgElementHistory() {
      this.$confirm(
        'This will permanently delete the history. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(() => {
        this._cleaeSvgElementHistory({ clipId: this.SELECTED_CLIP.id })
        this.$message({
          type: 'success',
          message: 'Delete completed'
        })
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
    outline-offset: -0.2rem;
  }
  .title-card {
    font-size: 1.4rem;
    text-align: left;
    padding-left: 1rem;
    .title-block {
      display: flex;
      align-items: center;
      i {
        width: 14px;
        cursor: pointer;
      }
      span {
        width: calc(100% - 1.4rem);
        padding-right: 2.4rem;
        text-align: center;
      }
    }
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
