import types from '@/store/modules/clips/types'
import mutations, {
  adjustSvgElementPositions
} from '@/store/modules/clips/mutations'
import { getRectangle } from '@/commons/models/svgElements'

describe('store/modules/clips/mutations', () => {
  describe('adjustSvgElementPositions キャンバスサイズ変更に伴う svgElement の位置調整', () => {
    it('mainFunction の前後でキャンバスサイズに変化が合った場合、 svgElement の位置が調整されること', () => {
      let count = 0
      const state = {
        clipList: [
          {
            svgElementList: [getRectangle({ x: 0, y: 0 })]
          }
        ]
      }
      adjustSvgElementPositions({
        state,
        getters: {
          [types.g.WHOLE_SIZE]: () => {
            if (count === 0) {
              count++
              return {
                width: 100,
                height: 100
              }
            } else {
              return {
                width: 200,
                height: 300
              }
            }
          }
        }
      })
      expect(state.clipList[0].svgElementList[0].x).to.equal(50)
      expect(state.clipList[0].svgElementList[0].y).to.equal(100)
    })
  })
  describe('SET_MAX_SIZE maxSizeセット', () => {
    it('selectedId が -1 の場合、末尾に追加されること', () => {
      const state = { maxSize: 1 }
      mutations[types.m.SET_MAX_SIZE](state, 2)
      expect(state.maxSize).to.equal(2)
    })
  })
  describe('ADD_CLIP', () => {
    context('index省略の場合', () => {
      it('selectedId が -1 の場合、末尾に追加されること', () => {
        const state = {
          clipList: [
            { id: 1, svgElementList: [] },
            { id: 2, svgElementList: [] }
          ],
          selectedId: -1
        }
        mutations[types.m.ADD_CLIP](state, {
          clip: { id: 3, svgElementList: [] }
        })
        expect(state.clipList).to.have.lengthOf(3)
        expect(state.clipList[2].id).to.equal(3)
      })
      it('selectedId が -1 ではない場合、 selectedId の次に追加されること', () => {
        const state = {
          clipList: [
            { id: 1, svgElementList: [] },
            { id: 2, svgElementList: [] }
          ],
          selectedId: 1
        }
        mutations[types.m.ADD_CLIP](state, {
          clip: { id: 3, svgElementList: [] }
        })
        expect(state.clipList).to.have.lengthOf(3)
        expect(state.clipList[1].id).to.equal(3)
      })
    })
    context('index指定の場合', () => {
      it('index の位置に追加されること', () => {
        const state = {
          clipList: [
            { id: 1, svgElementList: [] },
            { id: 2, svgElementList: [] }
          ],
          selectedId: -1
        }
        mutations[types.m.ADD_CLIP](state, {
          clip: { id: 3, svgElementList: [] },
          index: 1
        })
        expect(state.clipList).to.have.lengthOf(3)
        expect(state.clipList[1].id).to.equal(3)
      })
    })
  })
  describe('REMOVE_CLIP', () => {
    context('selectedId が 削除対象ではないとき', () => {
      const state = {
        clipList: [
          { id: 1, svgElementList: [] },
          { id: 2, svgElementList: [] }
        ],
        selectedId: 2
      }
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
          clipList: [
            { id: 1, svgElementList: [] },
            { id: 2, svgElementList: [] },
            { id: 3, svgElementList: [] }
          ],
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
            clipList: [
              { id: 1, svgElementList: [] },
              { id: 2, svgElementList: [] },
              { id: 3, svgElementList: [] }
            ],
            selectedId: 1
          }
          mutations[types.m.REMOVE_CLIP](state, 1)
          it('selectedId が 先頭要素の id になること', () => {
            expect(state.selectedId).to.equal(2)
          })
        })
        context('削除後の clipList に要素がないとき', () => {
          const state = {
            clipList: [{ id: 1, svgElementList: [] }],
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
  describe('ADD_SVG_ELEMENT', () => {
    it('指定 clipId の clip に svgElement が追加されること', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [],
            svgElementUndoStack: [],
            svgElementRedoStack: []
          }
        ]
      }
      mutations[types.m.ADD_SVG_ELEMENT](state, {
        clipId: 1,
        svgElement: 'abc'
      })
      expect(state.clipList[0].svgElementList[0]).to.equal('abc')
      expect(state.clipList[0].svgElementList).to.have.lengthOf(1)
    })
    it('svgElementList を渡すと複数要素が追加されること', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [{ id: 2 }, { id: 3 }],
            svgElementUndoStack: [],
            svgElementRedoStack: []
          }
        ]
      }
      mutations[types.m.ADD_SVG_ELEMENT](state, {
        clipId: 1,
        svgElementList: [{ id: 4 }, { id: 5 }]
      })
      const elmList = state.clipList[0].svgElementList
      expect(elmList[0].id).to.equal(2)
      expect(elmList[1].id).to.equal(3)
      expect(elmList[2].id).to.equal(4)
      expect(elmList[3].id).to.equal(5)
    })
    it('svgElementUndoStack に履歴が追加されること', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [],
            svgElementUndoStack: [],
            svgElementRedoStack: ['a', 'b']
          }
        ]
      }
      mutations[types.m.ADD_SVG_ELEMENT](state, {
        clipId: 1,
        svgElement: { id: 10 }
      })
      const data = state.clipList[0].svgElementUndoStack[0]
      expect(data.type).to.equal('ADD')
      expect(data.svgElementList[0].id).to.equal(10)
      expect(state.clipList[0].svgElementRedoStack).to.have.lengthOf(0)
    })
  })
  describe('UPDATE_SVG_ELEMENT', () => {
    it('指定 clipId の clip の svgElement が差分更新されること', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [{ id: 2, name: 'a', x: 10 }, { id: 3, name: 'c' }],
            svgElementUndoStack: [],
            svgElementRedoStack: []
          }
        ]
      }
      mutations[types.m.UPDATE_SVG_ELEMENT](state, {
        clipId: 1,
        svgElementList: [{ id: 2, name: 'b' }]
      })
      const elmList = state.clipList[0].svgElementList
      expect(elmList[0].id).to.equal(2)
      expect(elmList[0].name).to.equal('b')
      expect(elmList[0].x).to.equal(10)
      expect(elmList[1].name).to.equal('c')
      expect(elmList).to.have.lengthOf(2)
    })
    it('svgElementList を渡すと複数要素が更新されること', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [{ id: 2, name: 'a', x: 10 }, { id: 3, name: 'c' }],
            svgElementUndoStack: [],
            svgElementRedoStack: []
          }
        ]
      }
      mutations[types.m.UPDATE_SVG_ELEMENT](state, {
        clipId: 1,
        svgElementList: [{ id: 2, name: 'b' }, { id: 3, name: 'bb' }]
      })
      const elmList = state.clipList[0].svgElementList
      expect(elmList[0].id).to.equal(2)
      expect(elmList[0].name).to.equal('b')
      expect(elmList[0].x).to.equal(10)
      expect(elmList[1].name).to.equal('bb')
      expect(elmList).to.have.lengthOf(2)
    })
    it('更新された要素の前回状態が差分として履歴に追加されること', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [{ id: 2, name: 'a', x: 10 }],
            svgElementUndoStack: [],
            svgElementRedoStack: ['a', 'b']
          }
        ]
      }
      mutations[types.m.UPDATE_SVG_ELEMENT](state, {
        clipId: 1,
        svgElementList: [{ id: 2, name: 'b' }]
      })
      const data = state.clipList[0].svgElementUndoStack[0]
      expect(data.type).to.equal('UPDATE')
      expect(data.svgElementList[0].id).to.equal(2)
      expect(data.svgElementList[0].name).to.equal('a')
      expect(data.svgElementList[0].x).to.equal(undefined)
      expect(state.clipList[0].svgElementRedoStack).to.have.lengthOf(0)
    })
  })
  describe('REMOVE_SVG_ELEMENT', () => {
    it('指定 clipId の clip の svgElement が削除されること', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [{ id: 2 }, { id: 3 }],
            svgElementUndoStack: [],
            svgElementRedoStack: []
          }
        ]
      }
      mutations[types.m.REMOVE_SVG_ELEMENT](state, {
        clipId: 1,
        svgElementId: 2
      })
      const elm = state.clipList[0].svgElementList[0]
      expect(elm.id).to.equal(3)
      expect(state.clipList).to.have.lengthOf(1)
    })
    it('svgElementIdList を渡すと複数要素が削除されること', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [{ id: 1 }, { id: 2 }, { id: 3 }],
            svgElementUndoStack: [],
            svgElementRedoStack: []
          }
        ]
      }
      mutations[types.m.REMOVE_SVG_ELEMENT](state, {
        clipId: 1,
        svgElementIdList: [1, 3]
      })
      const elmList = state.clipList[0].svgElementList
      expect(elmList[0].id).to.equal(2)
      expect(elmList).to.have.lengthOf(1)
    })
  })
  it('削除した要素が履歴に追加されること', () => {
    const state = {
      clipList: [
        {
          id: 1,
          svgElementList: [{ id: 2, x: 0 }, { id: 3 }],
          svgElementUndoStack: [],
          svgElementRedoStack: ['a', 'b']
        }
      ]
    }
    mutations[types.m.REMOVE_SVG_ELEMENT](state, {
      clipId: 1,
      svgElementIdList: [2]
    })
    const data = state.clipList[0].svgElementUndoStack[0]
    expect(data.type).to.equal('REMOVE')
    expect(data.svgElementList[0].id).to.equal(2)
    expect(data.svgElementList[0].x).to.equal(0)
    expect(data.svgElementList[0]._index).to.equal(0)
    expect(state.clipList[0].svgElementRedoStack).to.have.lengthOf(0)
  })
  describe('UNDO_SVG_ELEMENT もとに戻す', () => {
    describe('ADD 追加をもとに戻す', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [{ id: 2 }, { id: 3 }],
            svgElementUndoStack: [
              { type: 'ADD', svgElementList: [{ id: 3 }] },
              { type: 'ADD', svgElementList: [{ id: 2 }] }
            ],
            svgElementRedoStack: []
          }
        ]
      }
      mutations[types.m.UNDO_SVG_ELEMENT](state, { clipId: 1 })
      const clip = state.clipList[0]
      const undoStack = clip.svgElementUndoStack
      const redoStack = clip.svgElementRedoStack
      it('undoスタックの最後に保存されいてる要素が削除されること', () => {
        expect(clip.svgElementList[0].id).to.equal(3)
        expect(clip.svgElementList).to.lengthOf(1)
      })
      it('undoスタックがpopされていること', () => {
        expect(undoStack).to.have.lengthOf(1)
      })
      it('redoスタックに履歴が追加されること', () => {
        expect(redoStack).to.have.lengthOf(1)
        expect(redoStack[0].type).to.equal('ADD')
        expect(redoStack[0].svgElementList[0].id).to.equal(2)
      })
    })
    describe('UPDATE 更新をもとに戻す', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [{ id: 2, x: 20, y: 21 }, { id: 3, x: 30, y: 31 }],
            svgElementUndoStack: [
              { type: 'UPDATE', svgElementList: [{ id: 3, x: 300 }] },
              { type: 'UPDATE', svgElementList: [{ id: 2, x: 200 }] }
            ],
            svgElementRedoStack: []
          }
        ]
      }
      mutations[types.m.UNDO_SVG_ELEMENT](state, { clipId: 1 })
      const clip = state.clipList[0]
      const undoStack = clip.svgElementUndoStack
      const redoStack = clip.svgElementRedoStack
      it('undoスタックの最後に保存されいてる要素が差し戻されること', () => {
        expect(clip.svgElementList[0].id).to.equal(2)
        expect(clip.svgElementList[0].x).to.equal(200)
        expect(clip.svgElementList[0].y).to.equal(21)
        expect(clip.svgElementList).to.lengthOf(2)
      })
      it('undoスタックがpopされていること', () => {
        expect(undoStack).to.have.lengthOf(1)
      })
      it('redoスタックに履歴が追加されること', () => {
        expect(redoStack).to.have.lengthOf(1)
        expect(redoStack[0].type).to.equal('UPDATE')
        expect(redoStack[0].svgElementList[0].id).to.equal(2)
        expect(redoStack[0].svgElementList[0].x).to.equal(20)
        expect(redoStack[0].svgElementList[0].y).to.equal(undefined)
      })
    })
    describe('REMOVE 削除をもとに戻す', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [{ id: 1 }],
            svgElementUndoStack: [
              { type: 'REMOVE', svgElementList: [{ id: 3, _index: 0 }] },
              { type: 'REMOVE', svgElementList: [{ id: 2, _index: 0 }] }
            ],
            svgElementRedoStack: []
          }
        ]
      }
      mutations[types.m.UNDO_SVG_ELEMENT](state, { clipId: 1 })
      const clip = state.clipList[0]
      const undoStack = clip.svgElementUndoStack
      const redoStack = clip.svgElementRedoStack
      it('undoスタックの最後に保存されいてる要素が追加されること', () => {
        expect(clip.svgElementList[0].id).to.equal(2)
        expect(clip.svgElementList[1].id).to.equal(1)
        expect(clip.svgElementList).to.lengthOf(2)
      })
      it('undoスタックがpopされていること', () => {
        expect(undoStack).to.have.lengthOf(1)
      })
      it('redoスタックに履歴が追加されること', () => {
        expect(redoStack).to.have.lengthOf(1)
        expect(redoStack[0].type).to.equal('REMOVE')
        expect(redoStack[0].svgElementList[0].id).to.equal(2)
      })
    })
  })
  describe('REDO_SVG_ELEMENT やり直す', () => {
    describe('ADD 追加をやり直す', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [{ id: 2 }, { id: 3 }],
            svgElementUndoStack: [],
            svgElementRedoStack: [
              { type: 'ADD', svgElementList: [{ id: 4, _index: 0 }] },
              { type: 'ADD', svgElementList: [{ id: 5, x: 50, _index: 0 }] }
            ]
          }
        ]
      }
      mutations[types.m.REDO_SVG_ELEMENT](state, { clipId: 1 })
      const clip = state.clipList[0]
      const undoStack = clip.svgElementUndoStack
      const redoStack = clip.svgElementRedoStack
      it('redoスタックの最後に保存されいてる要素が追加されること', () => {
        expect(clip.svgElementList[0].id).to.equal(5)
        expect(clip.svgElementList[0].x).to.equal(50)
        expect(clip.svgElementList).to.lengthOf(3)
      })
      it('redoスタックがpopされていること', () => {
        expect(redoStack).to.have.lengthOf(1)
      })
      it('undoスタックに履歴が追加されること', () => {
        expect(undoStack).to.have.lengthOf(1)
        expect(undoStack[0].type).to.equal('ADD')
        expect(undoStack[0].svgElementList[0].id).to.equal(5)
      })
    })
    describe('UPDATE 更新をやり直す', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [{ id: 2, x: 20, y: 21 }, { id: 3, x: 30, y: 31 }],
            svgElementUndoStack: [],
            svgElementRedoStack: [
              { type: 'UPDATE', svgElementList: [{ id: 3, x: 300 }] },
              { type: 'UPDATE', svgElementList: [{ id: 2, x: 200 }] }
            ]
          }
        ]
      }
      mutations[types.m.REDO_SVG_ELEMENT](state, { clipId: 1 })
      const clip = state.clipList[0]
      const undoStack = clip.svgElementUndoStack
      const redoStack = clip.svgElementRedoStack
      it('redoスタックの最後に保存されいてる要素がやり直されること', () => {
        expect(clip.svgElementList[0].id).to.equal(2)
        expect(clip.svgElementList[0].x).to.equal(200)
        expect(clip.svgElementList[0].y).to.equal(21)
        expect(clip.svgElementList).to.lengthOf(2)
      })
      it('redoスタックがpopされていること', () => {
        expect(redoStack).to.have.lengthOf(1)
      })
      it('undoスタックに履歴が追加されること', () => {
        expect(undoStack).to.have.lengthOf(1)
        expect(undoStack[0].type).to.equal('UPDATE')
        expect(undoStack[0].svgElementList[0].id).to.equal(2)
        expect(undoStack[0].svgElementList[0].x).to.equal(20)
        expect(undoStack[0].svgElementList[0].y).to.equal(undefined)
        expect(undoStack[0].svgElementList).to.have.lengthOf(1)
      })
    })
    describe('REMOVE 削除をやり直す', () => {
      const state = {
        clipList: [
          {
            id: 1,
            svgElementList: [{ id: 2, x: 20 }, { id: 3 }],
            svgElementUndoStack: [],
            svgElementRedoStack: [
              { type: 'REMOVE', svgElementList: [{ id: 3 }] },
              { type: 'REMOVE', svgElementList: [{ id: 2 }] }
            ]
          }
        ]
      }
      mutations[types.m.REDO_SVG_ELEMENT](state, { clipId: 1 })
      const clip = state.clipList[0]
      const undoStack = clip.svgElementUndoStack
      const redoStack = clip.svgElementRedoStack
      it('redoスタックの最後に保存されいてる要素が削除されること', () => {
        expect(clip.svgElementList[0].id).to.equal(3)
        expect(clip.svgElementList).to.lengthOf(1)
      })
      it('redoスタックがpopされていること', () => {
        expect(redoStack).to.have.lengthOf(1)
      })
      it('undoスタックに履歴が追加されること', () => {
        expect(undoStack).to.have.lengthOf(1)
        expect(undoStack[0].type).to.equal('REMOVE')
        expect(undoStack[0].svgElementList[0].id).to.equal(2)
        expect(undoStack[0].svgElementList[0].x).to.equal(20)
        expect(undoStack[0].svgElementList[0]._index).to.equal(0)
      })
    })
  })
  describe('JUMP_SVG_ELEMENT_HISTORY 履歴ジャンプ', () => {
    const getState = () => ({
      clipList: [
        {
          id: 1,
          svgElementList: [{ id: 2, x: 1 }, { id: 3 }],
          svgElementUndoStack: [
            { type: 'UPDATE', svgElementList: [{ id: 2, x: 2 }] },
            { type: 'UPDATE', svgElementList: [{ id: 2, x: 3 }] }
          ],
          svgElementRedoStack: [
            { type: 'UPDATE', svgElementList: [{ id: 2, x: 4 }] },
            { type: 'UPDATE', svgElementList: [{ id: 2, x: 5 }] }
          ]
        }
      ]
    })
    it('先頭ジャンプが正しく行えること', () => {
      const state = getState()
      mutations[types.m.JUMP_SVG_ELEMENT_HISTORY](state, { clipId: 1, to: 0 })
      const clip = state.clipList[0]
      const undoStack = clip.svgElementUndoStack
      const redoStack = clip.svgElementRedoStack
      expect(undoStack).to.lengthOf(4)
      expect(redoStack).to.lengthOf(0)
    })
    it('末端ジャンプが正しく行えること', () => {
      const state = getState()
      mutations[types.m.JUMP_SVG_ELEMENT_HISTORY](state, { clipId: 1, to: 4 })
      const clip = state.clipList[0]
      const undoStack = clip.svgElementUndoStack
      const redoStack = clip.svgElementRedoStack
      expect(undoStack).to.lengthOf(0)
      expect(redoStack).to.lengthOf(4)
    })
    it('redo途中へのジャンプが正しく行えること', () => {
      const state = getState()
      mutations[types.m.JUMP_SVG_ELEMENT_HISTORY](state, { clipId: 1, to: 1 })
      const clip = state.clipList[0]
      const undoStack = clip.svgElementUndoStack
      const redoStack = clip.svgElementRedoStack
      expect(undoStack).to.lengthOf(3)
      expect(redoStack).to.lengthOf(1)
    })
    it('undo途中へのジャンプが正しく行えること', () => {
      const state = getState()
      mutations[types.m.JUMP_SVG_ELEMENT_HISTORY](state, { clipId: 1, to: 3 })
      const clip = state.clipList[0]
      const undoStack = clip.svgElementUndoStack
      const redoStack = clip.svgElementRedoStack
      expect(undoStack).to.lengthOf(1)
      expect(redoStack).to.lengthOf(3)
    })
    it('現在位置のジャンプが正しく行えること', () => {
      const state = getState()
      mutations[types.m.JUMP_SVG_ELEMENT_HISTORY](state, { clipId: 1, to: 2 })
      const clip = state.clipList[0]
      const undoStack = clip.svgElementUndoStack
      const redoStack = clip.svgElementRedoStack
      expect(undoStack).to.lengthOf(2)
      expect(redoStack).to.lengthOf(2)
    })
  })
  describe('CLEAR_SVG_ELEMENT_HISTORY 履歴クリア', () => {
    const getState = () => ({
      clipList: [
        {
          id: 1,
          svgElementUndoStack: [
            { type: 'UPDATE', svgElementList: [{ id: 2, x: 2 }] },
            { type: 'UPDATE', svgElementList: [{ id: 2, x: 3 }] }
          ],
          svgElementRedoStack: [
            { type: 'UPDATE', svgElementList: [{ id: 2, x: 4 }] },
            { type: 'UPDATE', svgElementList: [{ id: 2, x: 5 }] }
          ]
        }
      ]
    })
    it('履歴がクリアされること', () => {
      const state = getState()
      mutations[types.m.CLEAR_SVG_ELEMENT_HISTORY](state, { clipId: 1 })
      const clip = state.clipList[0]
      const undoStack = clip.svgElementUndoStack
      const redoStack = clip.svgElementRedoStack
      expect(undoStack).to.lengthOf(0)
      expect(redoStack).to.lengthOf(0)
    })
  })
  describe('IMPORT_STATE state復元', () => {
    const getState = () => ({
      clipList: [
        {
          id: 1,

          svgElementUndoStack: [
            {
              type: 'UPDATE',
              svgElementList: [{ id: 2, x: 2, name: 'rectangle' }]
            },
            {
              type: 'UPDATE',
              svgElementList: [{ id: 2, x: 3, name: 'rectangle' }]
            }
          ],
          svgElementRedoStack: [
            {
              type: 'UPDATE',
              svgElementList: [{ id: 2, x: 4, name: 'circle' }]
            },
            {
              type: 'UPDATE',
              svgElementList: [{ id: 2, x: 5, name: 'circle' }]
            }
          ]
        },
        { id: 2 }
      ],
      selectedId: 2,
      maxSize: 300
    })
    it('clipList が復元されること', () => {
      const state = {}
      mutations[types.m.IMPORT_STATE](state, getState())
      expect(state.clipList).to.lengthOf(2)
      expect(state.clipList[1].id).to.equal(2)
      expect(state.clipList[1].svgElementUndoStack).to.have.lengthOf(0)
    })
    it('clipList 以外が復元されること', () => {
      const state = {}
      mutations[types.m.IMPORT_STATE](state, getState())
      expect(state.selectedId).to.equal(2)
      expect(state.maxSize).to.equal(300)
    })
    it('省略されたプロパティはデフォルトのままであること', () => {
      const state = {
        clipList: [],
        selectedId: -1,
        maxSize: 1200
      }
      mutations[types.m.IMPORT_STATE](state, {})
      expect(state.clipList).to.lengthOf(0)
      expect(state.selectedId).to.equal(-1)
      expect(state.maxSize).to.equal(1200)
    })
  })
  describe('ADD_LAYER', () => {
    context('index省略の場合', () => {
      it('末尾に追加されること', () => {
        const state = {
          layerList: [{ id: 1 }, { id: 2 }]
        }
        mutations[types.m.ADD_LAYER](state, {
          layer: { id: 3 }
        })
        expect(state.layerList).to.have.lengthOf(3)
        expect(state.layerList[2].id).to.equal(3)
      })
    })
    context('index指定の場合', () => {
      it('index の位置に追加されること', () => {
        const state = {
          layerList: [{ id: 1 }, { id: 2 }]
        }
        mutations[types.m.ADD_LAYER](state, {
          layer: { id: 3 },
          index: 1
        })
        expect(state.layerList).to.have.lengthOf(3)
        expect(state.layerList[1].id).to.equal(3)
      })
    })
  })
  describe('REMOVE_LAYER', () => {
    it('引数で指定した id の要素が削除されること', () => {
      const state = {
        layerList: [{ id: 1 }, { id: 2 }]
      }
      mutations[types.m.REMOVE_LAYER](state, 1)
      expect(state.layerList).to.have.lengthOf(1)
      expect(state.layerList[0].id).to.equal(2)
    })
  })
  describe('SELECT_LAYER', () => {
    it('選択対象が存在する場合、 selectedLayerId が変更されること', () => {
      const state = {
        clipList: [],
        layerList: [{ id: 1 }, { id: 2 }, { id: 3 }],
        selectedLayerId: 2
      }
      mutations[types.m.SELECT_LAYER](state, 1)
      expect(state.selectedLayerId).to.equal(1)
    })
    it('選択対象が存在しない場合、 selectedLayerId が変更されないこと', () => {
      const state = {
        clipList: [],
        layerList: [{ id: 1 }, { id: 2 }, { id: 3 }],
        selectedLayerId: 2
      }
      mutations[types.m.SELECT_LAYER](state, 4)
      expect(state.selectedLayerId).to.equal(2)
    })
    describe('selectedId 更新', () => {
      it('時間に対応するクリップが選択されること', () => {
        const state = {
          selectedId: 1,
          clipList: [{ id: 1, delay: 100 }, { id: 2, delay: 100 }],
          selectedLayerId: -1,
          layerList: [{ id: 1, from: 0 }, { id: 2 }, { id: 3 }]
        }
        mutations[types.m.SELECT_LAYER](state, 1)
        expect(state.selectedId).to.equal(1)
      })
      it('境界値は後方要素が選択されること', () => {
        const state = {
          selectedId: 1,
          clipList: [{ id: 1, delay: 100 }, { id: 2, delay: 100 }],
          selectedLayerId: -1,
          layerList: [{ id: 1, from: 100 }, { id: 2 }, { id: 3 }]
        }
        mutations[types.m.SELECT_LAYER](state, 1)
        expect(state.selectedId).to.equal(2)
      })
    })
  })
  describe('UPDATE_LAYER_RANGE', () => {
    it('対象レイヤーの from と to が変更されること', () => {
      const state = {
        layerList: [{ id: 1, from: 0, to: 0 }, { id: 2 }, { id: 3 }]
      }
      mutations[types.m.UPDATE_LAYER_RANGE](state, { id: 1, from: 2, to: 3 })
      expect(state.layerList[0].id).to.equal(1)
      expect(state.layerList[0].from).to.equal(2)
      expect(state.layerList[0].to).to.equal(3)
    })
  })
})
