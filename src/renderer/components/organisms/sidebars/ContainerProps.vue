<template>
  <div class="container-props">
    <div v-if="EDIT_TARGET_SVG_ELEMENT_CONTAINER">
      <template v-if="selectedClip">
        <p class="title">Clip</p>
        <div class="content">
          <div class="button-block">
            <el-dropdown
              size="mini"
              split-button type="danger"
              trigger="click"
              @click="deleteClip"
              @command="deleteCommand"
            >
              <i class="el-icon-delete" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="all">Delete All</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              type="primary" size="mini"
              @click="cloneClip"
            >
              Clone
            </el-button>
          </div>
          <div class="input-form">
            <span>Time(s): </span>
            <el-input
              class="input"
              size="mini"
              placeholder="Delay"
              type="number"
              step="0.1"
              :value="trimNumber(selectedClip.delay / 1000)"
              @input="updateDelay"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <p class="title">Layer</p>
        <div class="content">
          <div class="button-block">
            <el-dropdown
              size="mini"
              split-button type="danger"
              trigger="click"
              @click="deleteLayer"
              @command="deleteCommand"
            >
              <i class="el-icon-delete" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="all">Delete All</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              type="primary" size="mini"
              @click="cloneLayer"
            >
              Clone
            </el-button>
          </div>
          <div class="input-form">
            <span>From(s): </span>
            <el-input
              class="input"
              size="mini"
              placeholder="From"
              type="number"
              step="0.1"
              :value="trimNumber(selectedLayer.from / 1000)"
              @input="changeFrom"
            />
          </div>
          <div class="input-form">
            <span>To(s): </span>
            <el-input
              class="input"
              size="mini"
              placeholder="From"
              type="number"
              step="0.1"
              :value="trimNumber(selectedLayer.to / 1000)"
              @input="changeTo"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import clipTypes from '@/store/modules/clips/types'

export default {
  computed: {
    ...mapGetters({
      EDIT_TARGET_TYPE: clipTypes.g.EDIT_TARGET_TYPE,
      EDIT_TARGET_SVG_ELEMENT_CONTAINER:
        clipTypes.g.EDIT_TARGET_SVG_ELEMENT_CONTAINER,
      WHOLE_DELAY: clipTypes.g.WHOLE_DELAY
    }),
    isEditClip() {
      return this.EDIT_TARGET_TYPE === 'clip'
    },
    selectedClip() {
      return this.isEditClip ? this.EDIT_TARGET_SVG_ELEMENT_CONTAINER : null
    },
    selectedLayer() {
      return !this.isEditClip ? this.EDIT_TARGET_SVG_ELEMENT_CONTAINER : null
    }
  },
  methods: {
    ...mapActions({
      _deleteClip: clipTypes.a.DELETE_CLIP,
      _deleteAllClip: clipTypes.a.DELETE_ALL_CLIP,
      _updateDelay: clipTypes.a.UPDATE_DELAY,
      _cloneClip: clipTypes.a.CLONE_CLIP,
      _updateLayerRange: clipTypes.a.UPDATE_LAYER_RANGE,
      _deleteLayer: clipTypes.a.DELETE_LAYER,
      _cloneLayer: clipTypes.a.CLONE_LAYER
    }),
    trimNumber(num) {
      return Math.floor(num * 1000) / 1000
    },
    updateDelay(val) {
      const delay = parseFloat(val) * 1000
      if (delay < 10 || 10000 < delay) {
        this.$notify.error({
          title: 'Error',
          message: 'Delay time must be 0.01 to 10.'
        })
      } else {
        this._updateDelay({ id: this.selectedClip.id, delay })
      }
    },
    cloneClip() {
      this._cloneClip({ id: this.selectedClip.id })
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
        this._deleteClip(this.selectedClip.id)
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
    },
    changeFrom(val) {
      const from = parseFloat(val) * 1000
      if (from < 0 || this.selectedLayer.to < from) {
        this.$notify.error({
          title: 'Error',
          message: 'Invalid range.'
        })
      } else {
        this._updateLayerRange({
          id: this.selectedLayer.id,
          from: from,
          to: this.selectedLayer.to
        })
      }
    },
    changeTo(val) {
      const to = parseFloat(val) * 1000
      if (to < this.selectedLayer.from || this.WHOLE_DELAY < to) {
        this.$notify.error({
          title: 'Error',
          message: 'Invalid range.'
        })
      } else {
        this._updateLayerRange({
          id: this.selectedLayer.id,
          from: this.selectedLayer.from,
          to: to
        })
      }
    },
    deleteLayer() {
      this.$confirm(
        'This will permanently delete the layer. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(() => {
        this._deleteLayer(this.selectedLayer.id)
        this.$message({
          type: 'success',
          message: 'Delete completed'
        })
      })
    },
    cloneLayer() {
      this._cloneLayer({ id: this.selectedLayer.id })
    }
  }
}
</script>

<style lang="scss" scoped>
$title-height: 2.6rem;

.container-props {
  height: 100%;
  border: 0.1rem solid gray;
  border-bottom: none;
  > div {
    height: 100%;
    padding-bottom: 0.4rem;
  }
  .title {
    height: $title-height;
    background-color: #fff;
    border-bottom: 0.1rem solid gray;
  }
  .content {
    height: calc(100% - #{$title-height});
    overflow: auto;
  }
  .input-form {
    display: flex;
    justify-content: center;
    margin-top: 0.4rem;
    > span {
      width: 7rem;
      text-align: left;
    }
    .input {
      width: 10rem;
    }
  }
  .button-block {
    margin-top: 0.4rem;
  }
}
</style>
