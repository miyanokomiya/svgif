import types from '@main/store/modules/clips/types'
import mutations from '@main/store/modules/clips/mutations'

describe('store/modules/clips/mutations', () => {
  describe('ADD_CLIP', () => {
    context('index省略の場合', () => {
      it('selectedId が -1 の場合、末尾に追加されること', () => {
        const state = { clipList: [{ id: 1 }, { id: 2 }], selectedId: -1 }
        mutations[types.m.ADD_CLIP](state, { clip: { id: 3 } })
        expect(state.clipList).to.have.lengthOf(3)
        expect(state.clipList[2].id).to.equal(3)
      })
      it('selectedId が -1 ではない場合、 selectedId の次に追加されること', () => {
        const state = { clipList: [{ id: 1 }, { id: 2 }], selectedId: 1 }
        mutations[types.m.ADD_CLIP](state, { clip: { id: 3 } })
        expect(state.clipList).to.have.lengthOf(3)
        expect(state.clipList[1].id).to.equal(3)
      })
    })
    context('index指定の場合', () => {
      it('index の位置に追加されること', () => {
        const state = { clipList: [{ id: 1 }, { id: 2 }], selectedId: -1 }
        mutations[types.m.ADD_CLIP](state, {
          clip: { id: 3 },
          index: 1
        })
        expect(state.clipList).to.have.lengthOf(3)
        expect(state.clipList[1].id).to.equal(3)
      })
    })
  })
  describe('REMOVE_CLIP', () => {
    context('selectedId が 削除対象ではないとき', () => {
      const state = { clipList: [{ id: 1 }, { id: 2 }], selectedId: 2 }
      mutations[types.m.REMOVE_CLIP](state, 1)
      it('引数で指定した id の要素が削除されること', () => {
        expect(state.clipList).to.have.lengthOf(1)
        expect(state.clipList[0].id).to.equal(2)
      })
      it('selectedId が変化ないこと', () => {
        expect(state.selectedId).to.equal(2)
      })
    })
    context('selectedId が 削除対象のとき', () => {
      context('selectedId の要素が配列の先頭以外のとき', () => {
        const state = {
          clipList: [{ id: 1 }, { id: 2 }, { id: 3 }],
          selectedId: 2
        }
        mutations[types.m.REMOVE_CLIP](state, 2)
        it('selectedId が 削除対象の前の要素の id になること', () => {
          expect(state.selectedId).to.equal(1)
        })
      })
      context('selectedId の要素が配列の先頭のとき', () => {
        context('削除後の clipList に要素が１つ以上あるとき', () => {
          const state = {
            clipList: [{ id: 1 }, { id: 2 }, { id: 3 }],
            selectedId: 1
          }
          mutations[types.m.REMOVE_CLIP](state, 1)
          it('selectedId が 先頭要素の id になること', () => {
            expect(state.selectedId).to.equal(2)
          })
        })
        context('削除後の clipList に要素がないとき', () => {
          const state = {
            clipList: [{ id: 1 }],
            selectedId: 1
          }
          mutations[types.m.REMOVE_CLIP](state, 1)
          it('selectedId が -1 になること', () => {
            expect(state.selectedId).to.equal(-1)
          })
        })
      })
    })
  })
  describe('REMOVE_ALL_CLIP', () => {
    const state = {
      clipList: [{ id: 1 }, { id: 2 }, { id: 3 }],
      selectedId: 1
    }
    mutations[types.m.REMOVE_ALL_CLIP](state, 1)
    it('clipList が 空になること', () => {
      expect(state.clipList).to.be.lengthOf(0)
    })
    it('selectedId が -1 になること', () => {
      expect(state.selectedId).to.equal(-1)
    })
  })
  describe('SELECT_CLIP', () => {
    it('選択対象が存在する場合、 selectedId が変更されること', () => {
      const state = {
        clipList: [{ id: 1 }, { id: 2 }, { id: 3 }],
        selectedId: 2
      }
      mutations[types.m.SELECT_CLIP](state, 1)
      expect(state.selectedId).to.equal(1)
    })
    it('選択対象が存在しない場合、 selectedId が変更されないこと', () => {
      const state = {
        clipList: [{ id: 1 }, { id: 2 }, { id: 3 }],
        selectedId: 2
      }
      mutations[types.m.SELECT_CLIP](state, 4)
      expect(state.selectedId).to.equal(2)
    })
  })
  describe('SWAP_CLIP_ORDER', () => {
    context('from < to のとき', () => {
      it('from の要素がと to の位置に変更されること', () => {
        const state = {
          clipList: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
          selectedId: 2
        }
        mutations[types.m.SWAP_CLIP_ORDER](state, { from: 0, to: 2 })
        expect(state.clipList[0].id).to.equal(2)
        expect(state.clipList[1].id).to.equal(3)
        expect(state.clipList[2].id).to.equal(1)
        expect(state.clipList[3].id).to.equal(4)
      })
    })
    context('from > to のとき', () => {
      it('from の要素がと to の位置に変更されること', () => {
        const state = {
          clipList: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
          selectedId: 2
        }
        mutations[types.m.SWAP_CLIP_ORDER](state, { from: 2, to: 0 })
        expect(state.clipList[0].id).to.equal(3)
        expect(state.clipList[1].id).to.equal(1)
        expect(state.clipList[2].id).to.equal(2)
        expect(state.clipList[3].id).to.equal(4)
      })
    })
  })
  describe('UPDATE_DELAY', () => {
    it('対象idを持つclipの delay が変更されること', () => {
      const state = {
        clipList: [{ id: 1, delay: 0 }, { id: 2, delay: 0 }]
      }
      mutations[types.m.UPDATE_DELAY](state, { id: 2, delay: 1 })
      expect(state.clipList[0].delay).to.equal(0)
      expect(state.clipList[1].delay).to.equal(1)
    })
  })
  describe('SET_CANVAS_MODE', () => {
    it('canvasMode が変更されること', () => {
      const state = {
        canvasMode: 'abc'
      }
      mutations[types.m.SET_CANVAS_MODE](state, 'cba')
      expect(state.canvasMode).to.equal('cba')
    })
  })
  describe('ADD_SVG_ELEMENT', () => {
    it('指定 clipId の clip に svgElement が追加されること', () => {
      const state = {
        clipList: [{ id: 1, svgElementList: [] }]
      }
      mutations[types.m.ADD_SVG_ELEMENT](state, {
        clipId: 1,
        svgElement: 'abc'
      })
      expect(state.clipList[0].svgElementList[0]).to.equal('abc')
      expect(state.clipList[0].svgElementList).to.have.lengthOf(1)
    })
  })
  describe('UPDATE_SVG_ELEMENT', () => {
    it('指定 clipId の clip の svgElement が更新されること', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [{ id: 2, name: 'a' }, { id: 3, name: 'c' }]
          }
        ]
      }
      mutations[types.m.UPDATE_SVG_ELEMENT](state, {
        clipId: 1,
        svgElement: { id: 2, name: 'b' }
      })
      const elmList = state.clipList[0].svgElementList
      expect(elmList[0].id).to.equal(2)
      expect(elmList[0].name).to.equal('b')
      expect(elmList[1].name).to.equal('c')
      expect(elmList).to.have.lengthOf(2)
    })
  })
  describe('REMOVE_SVG_ELEMENT', () => {
    it('指定 clipId の clip の svgElement が削除されること', () => {
      const state = {
        clipList: [{ id: 1, svgElementList: [{ id: 2 }, { id: 3 }] }]
      }
      mutations[types.m.REMOVE_SVG_ELEMENT](state, {
        clipId: 1,
        svgElementId: 2
      })
      const elm = state.clipList[0].svgElementList[0]
      expect(elm.id).to.equal(3)
      expect(state.clipList).to.have.lengthOf(1)
    })
  })
})
