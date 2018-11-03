<template>
  <div class="canvas-footer">
    <template v-if="SELECTED_CLIP">
      <el-button
        class="delete-button"
        type="danger" size="mini" round
        icon="el-icon-delete"
        @click="deleteClip"
      />
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
    </template>
    <span class="total-delay">Total Time(s): {{WHOLE_DELAY / 1000}}</span>
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
import clipTypes from '@main/store/modules/clips/types'

export default {
  computed: {
    ...mapGetters({
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP,
      WHOLE_DELAY: clipTypes.g.WHOLE_DELAY
    })
  },
  methods: {
    ...mapActions({
      _deleteClip: clipTypes.a.DELETE_CLIP,
      _updateDelay: clipTypes.a.UPDATE_DELAY
    }),
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
    margin-left: auto;
  }
}
</style>
