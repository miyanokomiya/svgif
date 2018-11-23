<template>
  <div
    v-if="EDIT_TARGET_SVG_ELEMENT_CONTAINER"
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
      <HistoryItem
        v-for="(data, i) in redoStack"
        :key="i"
        :label="data.type"
        :count="data.svgElementList.length"
        @click.native="jumpSvgElementHistory(i)"
      />
      <HistoryItem
        v-for="(data, i) in undoStackReverse"
        :key="redoStack.length + i"
        :label="data.type"
        :count="data.svgElementList.length"
        :current="!isOldest && i === 0"
        @click.native="jumpSvgElementHistory(redoStack.length + i)"
      />
      <HistoryItem
        label="Oldest"
        :current="isOldest"
        @click.native="jumpSvgElementHistory(allHistory.length)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import clipTypes from '@/store/modules/clips/types'
import HistoryItem from '@/components/molecules/HistoryItem'

export default {
  components: {
    HistoryItem
  },
  computed: {
    ...mapGetters({
      EDIT_TARGET_SVG_ELEMENT_CONTAINER:
        clipTypes.g.EDIT_TARGET_SVG_ELEMENT_CONTAINER
    }),
    undoStackReverse() {
      if (!this.EDIT_TARGET_SVG_ELEMENT_CONTAINER) return []
      return this.EDIT_TARGET_SVG_ELEMENT_CONTAINER.svgElementUndoStack
        .concat()
        .reverse()
    },
    redoStack() {
      if (!this.EDIT_TARGET_SVG_ELEMENT_CONTAINER) return []
      return this.EDIT_TARGET_SVG_ELEMENT_CONTAINER.svgElementRedoStack
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
        to
      })
    },
    undoSvgElement() {
      this.$svgif.selectedElementIdList = []
      this._undoSvgElement()
    },
    redoSvgElement() {
      this.$svgif.selectedElementIdList = []
      this._redoSvgElement()
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
        this._cleaeSvgElementHistory()
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
}
</style>
