import clips, { types } from '@main/store/modules/clips'

describe('store/modules/clips/mutations', () => {
  describe('ADD_CLIP', () => {
    context('index省略の場合', () => {
      it('selectedId が -1 の場合、末尾に追加されること', () => {
        const state = { clipList: [{ id: 1 }, { id: 2 }], selectedId: -1 }
        clips.mutations[types.m.ADD_CLIP](state, { clip: { id: 3 } })
        expect(state.clipList).to.have.lengthOf(3)
        expect(state.clipList[2].id).to.equal(3)
      })
      it('selectedId が -1 ではない場合、 selectedId の次に追加されること', () => {
        const state = { clipList: [{ id: 1 }, { id: 2 }], selectedId: 1 }
        clips.mutations[types.m.ADD_CLIP](state, { clip: { id: 3 } })
        expect(state.clipList).to.have.lengthOf(3)
        expect(state.clipList[1].id).to.equal(3)
      })
    })
    context('index指定の場合', () => {
      it('index の位置に追加されること', () => {
        const state = { clipList: [{ id: 1 }, { id: 2 }], selectedId: -1 }
        clips.mutations[types.m.ADD_CLIP](state, {
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
      clips.mutations[types.m.REMOVE_CLIP](state, 1)
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
        clips.mutations[types.m.REMOVE_CLIP](state, 2)
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
          clips.mutations[types.m.REMOVE_CLIP](state, 1)
          it('selectedId が 先頭要素の id になること', () => {
            expect(state.selectedId).to.equal(2)
          })
        })
        context('削除後の clipList に要素がないとき', () => {
          const state = {
            clipList: [{ id: 1 }],
            selectedId: 1
          }
          clips.mutations[types.m.REMOVE_CLIP](state, 1)
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
    clips.mutations[types.m.REMOVE_ALL_CLIP](state, 1)
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
      clips.mutations[types.m.SELECT_CLIP](state, 1)
      expect(state.selectedId).to.equal(1)
    })
    it('選択対象が存在しない場合、 selectedId が変更されないこと', () => {
      const state = {
        clipList: [{ id: 1 }, { id: 2 }, { id: 3 }],
        selectedId: 2
      }
      clips.mutations[types.m.SELECT_CLIP](state, 4)
      expect(state.selectedId).to.equal(2)
    })
  })
  describe('SWAP_ORDER', () => {
    context('from < to のとき', () => {
      it('from の要素がと to の位置に変更されること', () => {
        const state = {
          clipList: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
          selectedId: 2
        }
        clips.mutations[types.m.SWAP_ORDER](state, { from: 0, to: 2 })
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
        clips.mutations[types.m.SWAP_ORDER](state, { from: 2, to: 0 })
        expect(state.clipList[0].id).to.equal(3)
        expect(state.clipList[1].id).to.equal(1)
        expect(state.clipList[2].id).to.equal(2)
        expect(state.clipList[3].id).to.equal(4)
      })
    })
  })
})
