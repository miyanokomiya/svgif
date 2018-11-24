import types from '@/store/modules/clips/types'
import getters from '@/store/modules/clips/getters'

describe('store/modules/clips/getters', () => {
  describe('MAX_SIZE', () => {
    it('maxSize が取得されること', () => {
      const state = { maxSize: 1 }
      const maxSize = getters[types.g.MAX_SIZE](state)
      expect(maxSize).to.equal(1)
    })
  })
  describe('CLIP_LIST', () => {
    it('clipList が取得されること', () => {
      const state = {
        clipList: [1, 2]
      }
      const clipList = getters[types.g.CLIP_LIST](state)
      expect(clipList).to.have.lengthOf(2)
      expect(clipList[0]).to.equal(1)
      expect(clipList[1]).to.equal(2)
    })
  })
  describe('SELECTED_CLIP', () => {
    context('currentTime に対応した要素が存在する場合', () => {
      it('currentTime に対応した要素 が取得されること', () => {
        const state = {
          clipList: [
            { id: 1, delay: 10 },
            { id: 2, delay: 10 },
            { id: 3, delay: 10 }
          ],
          currentTime: 10
        }
        const clip = getters[types.g.SELECTED_CLIP](state)
        expect(clip.id).to.equal(2)
      })
    })
    context('currentTime が全体を超える場合', () => {
      it('最後のクリップが取得されること', () => {
        const state = {
          clipList: [
            { id: 1, delay: 10 },
            { id: 2, delay: 10 },
            { id: 3, delay: 10 }
          ],
          currentTime: 40
        }
        const clip = getters[types.g.SELECTED_CLIP](state)
        expect(clip.id).to.equal(3)
      })
    })
    context('currentTime が0未満の場合', () => {
      it('最初のクリップが取得されること', () => {
        const state = {
          clipList: [
            { id: 1, delay: 10 },
            { id: 2, delay: 10 },
            { id: 3, delay: 10 }
          ],
          currentTime: -1
        }
        const clip = getters[types.g.SELECTED_CLIP](state)
        expect(clip.id).to.equal(1)
      })
    })
  })
  describe('WHOLE_SIZE', () => {
    it('最大の width と height が取得されること', () => {
      const state = {
        clipList: [
          { id: 1, width: 3, height: 1 },
          { id: 2, width: 2, height: 2 },
          { id: 3, width: 1, height: 5 }
        ]
      }
      const size = getters[types.g.WHOLE_SIZE](state)
      expect(size.width).to.equal(3)
      expect(size.height).to.equal(5)
    })
  })
  describe('WHOLE_DELAY', () => {
    it('delay の合計が取得されること', () => {
      const state = {
        clipList: [
          { id: 1, delay: 1 },
          { id: 2, delay: 20 },
          { id: 3, delay: 30 }
        ]
      }
      const val = getters[types.g.WHOLE_DELAY](state)
      expect(val).to.equal(51)
    })
  })
  describe('STATE', () => {
    it('state が取得されること', () => {
      const state = 1
      const val = getters[types.g.STATE](state)
      expect(val).to.equal(1)
    })
  })
  describe('LAYER_LIST', () => {
    it('layerList が取得されること', () => {
      const state = {
        layerList: [1]
      }
      const val = getters[types.g.LAYER_LIST](state)
      expect(val).to.have.lengthOf(1)
      expect(val[0]).to.equal(1)
    })
  })
  describe('CURRENT_LAYER_LIST', () => {
    describe('currentTime を包含する layerList 取得', () => {
      it('from 側は境界を含むこと', () => {
        const state = {
          layerList: [
            { from: 0, to: 10 },
            { from: 5, to: 15 },
            { from: 10, to: 20 }
          ]
        }
        const mockGetters = {
          [types.g.CURRENT_TIME]: 5
        }
        const val = getters[types.g.CURRENT_LAYER_LIST](state, mockGetters)
        expect(val[1].from).to.equal(5)
      })
      it('to 側は境界を含まないこと', () => {
        const state = {
          layerList: [
            { from: 0, to: 10 },
            { from: 5, to: 15 },
            { from: 10, to: 20 }
          ]
        }
        const mockGetters = {
          [types.g.CURRENT_TIME]: 15
        }
        const val = getters[types.g.CURRENT_LAYER_LIST](state, mockGetters)
        expect(val).to.have.lengthOf(1)
        expect(val[0].from).to.equal(10)
      })
    })
  })
  describe('SELECTED_LAYER', () => {
    context('selectedLayerId に対応した要素が存在する場合', () => {
      it('selectedLayerId に対応した要素 が取得されること', () => {
        const state = {
          layerList: [{ id: 1 }, { id: 2 }, { id: 3 }],
          selectedLayerId: 2
        }
        const layer = getters[types.g.SELECTED_LAYER](state)
        expect(layer.id).to.equal(2)
      })
    })
    context('selectedLayerId に対応した要素が存在しない場合', () => {
      it('null が取得されること', () => {
        const state = {
          layerList: [{ id: 1 }, { id: 2 }, { id: 3 }],
          selectedLayerId: 4
        }
        const layer = getters[types.g.SELECTED_LAYER](state)
        expect(layer).to.equal(null)
      })
    })
  })
  describe('CURRENT_TIME', () => {
    it('currentTime が取得されること', () => {
      const state = { currentTime: 1 }
      const val = getters[types.g.CURRENT_TIME](state)
      expect(val).to.equal(1)
    })
  })
  describe('EDIT_TARGET_TYPE', () => {
    it('currentTime が取得されること', () => {
      const state = { editTargetType: 'clip' }
      const val = getters[types.g.EDIT_TARGET_TYPE](state)
      expect(val).to.equal('clip')
    })
  })
  describe('EDIT_TARGET_SVG_ELEMENT_CONTAINER', () => {
    it('editTargetType が clip のとき SELECTED_CLIP が取得されること', () => {
      const state = {
        editTargetType: 'clip',
        clipList: [{ id: 1, delay: 10 }],
        currentTime: 0
      }
      const val = getters[types.g.EDIT_TARGET_SVG_ELEMENT_CONTAINER](state)
      expect(val.id).to.equal(1)
    })
    it('editTargetType が layer のとき SELECTED_LAYER が取得されること', () => {
      const state = {
        editTargetType: 'layer',
        layerList: [{ id: 1 }],
        selectedLayerId: 1
      }
      const val = getters[types.g.EDIT_TARGET_SVG_ELEMENT_CONTAINER](state)
      expect(val.id).to.equal(1)
    })
  })
})
