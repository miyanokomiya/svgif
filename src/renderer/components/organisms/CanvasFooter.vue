<template>
  <div class="canvas-footer" v-if="SELECTED_CLIP">
    <el-dropdown size="mini" split-button type="danger" trigger="click" @click="deleteClip" @command="deleteCommand">
      <i class="el-icon-delete" />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="all">Delete All</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div>
      <span>Time(s): </span>
      <el-input
        class="delay-input"
        size="mini"
        placeholder="Delay"
        type="number"
        step="0.1"
        :value="SELECTED_CLIP.delay / 1000"
        @input="updateDelay"
      />
    </div>
    <el-button
      class="clone-button"
      type="primary" size="mini"
      @click="cloneClip"
    >
      Clone
    </el-button>
    <div class="total-delay"><span>Frame(ms): </span><span class="current-time">{{trimNumber(CURRENT_TIME)}}</span><span>/ {{trimNumber(WHOLE_DELAY)}}</span></div>
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-picture-outline"
      class="create-gif-button"
      @click="createGif"
    >
      Create Gif
    </el-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import clipTypes from '@/store/modules/clips/types'

export default {
  computed: {
    ...mapGetters({
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP,
      WHOLE_DELAY: clipTypes.g.WHOLE_DELAY,
      CURRENT_TIME: clipTypes.g.CURRENT_TIME
    })
  },
  methods: {
    ...mapActions({
      _deleteClip: clipTypes.a.DELETE_CLIP,
      _deleteAllClip: clipTypes.a.DELETE_ALL_CLIP,
      _updateDelay: clipTypes.a.UPDATE_DELAY,
      _cloneClip: clipTypes.a.CLONE_CLIP
    }),
    trimNumber(num) {
      return Math.floor(num)
    },
    createGif() {
      this.$emit('createGif')
    },
    updateDelay(val) {
      const delay = parseFloat(val) * 1000
      if (delay < 10 || 10000 < delay) {
        this.$notify.error({
          title: 'Error',
          message: 'Delay time must be 0.01 to 10.'
        })
      } else {
        this._updateDelay({ id: this.SELECTED_CLIP.id, delay })
      }
    },
    cloneClip() {
      this._cloneClip({ id: this.SELECTED_CLIP.id })
    },
    deleteClip() {
      this.$confirm(
        'This will permanently delete the clip. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(() => {
        this._deleteClip(this.SELECTED_CLIP.id)
        this.$message({
          type: 'success',
          message: 'Delete completed'
        })
      })
    },
    deleteAllClip() {
      this.$confirm(
        'This will permanently delete all clips. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(() => {
        this._deleteAllClip()
        this.$message({
          type: 'success',
          message: 'Delete completed'
        })
      })
    },
    deleteCommand(command) {
      if (command === 'all') {
        this.deleteAllClip()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.canvas-footer {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 100%;
  background-color: #b3c0d1;
  color: #333;
  > * {
    margin-left: 1rem;
    &:first-child {
      margin-left: 0;
    }
  }
  .delay-input {
    width: 10rem;
  }
  .total-delay {
    display: flex;
    margin-left: auto;
    .current-time {
      min-width: 8rem;
      text-align: right;
      margin-right: 0.6rem;
    }
  }
}
</style>
