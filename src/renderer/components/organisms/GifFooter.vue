<template>
  <div class="canvas-footer">
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-download"
      :disabled="!gif"
      @click="saveGifFile"
    >
      Export Gif
    </el-button>
    <div class="input-max-size">
      <span>Max Size(px): </span>
      <el-input
        class="max-size-input"
        size="mini"
        type="number"
        step="1"
        :value="MAX_SIZE"
        @input="updateMaxSize"
      />
    </div>
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
import { mapGetters, mapActions } from 'vuex'
import clipTypes from '@main/store/modules/clips/types'
import { saveGifFile } from '@/commons/utils/file'

export default {
  data: () => ({
    maxSize: 1200
  }),
  props: {
    gif: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters({
      WHOLE_DELAY: clipTypes.g.WHOLE_DELAY,
      MAX_SIZE: clipTypes.g.MAX_SIZE
    })
  },
  methods: {
    ...mapActions({
      _setMaxSize: clipTypes.a.SET_MAX_SIZE
    }),
    saveGifFile() {
      saveGifFile(this.gif)
    },
    createGif() {
      this.$emit('createGif', { maxSize: this.maxSize })
    },
    updateMaxSize(val) {
      const maxSize = parseInt(val)
      if (maxSize < 10 || 3000 < maxSize) {
        this.$notify.error({
          title: 'Error',
          message: 'Max size must be 10 to 3000.'
        })
      } else {
        this._setMaxSize(val)
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
  .input-max-size {
    margin-left: auto;
  }
  .max-size-input {
    width: 10rem;
  }
}
</style>
