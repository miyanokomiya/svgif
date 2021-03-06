import types from '@/store/modules/clips/types'
import actions from '@/store/modules/clips/actions'

function testAction({
  done,
  action,
  state = {},
  getters = {},
  payload,
  mutations = [],
  onThen = args => Promise.resolve(args),
  onCatch = args => Promise.reject(args)
}) {
  let count = 0
  const commit = (type, payload) => {
    const info = mutations[count]
    expect(type).to.equal(info.type)
    if (info.test) {
      info.test(payload)
    }
    count++
  }
  action({ state, commit, getters }, payload)
    .then(onThen)
    .then(() => {
      expect(count).to.equal(mutations.length)
      done()
    })
    .catch(onCatch)
    .catch(done)
}

describe('store/modules/clips/actions', () => {
  describe('SET_MAX_SIZE', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.SET_MAX_SIZE],
        payload: 1,
        mutations: [
          {
            type: types.m.SET_MAX_SIZE,
            test: maxSize => {
              expect(maxSize).to.equal(1)
            }
          }
        ]
      })
    })
  })
  describe('CREATE_CLIP', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.CREATE_CLIP],
        payload: { clip: { id: 2 }, index: 1 },
        mutations: [
          {
            type: types.m.ADD_CLIP,
            test: ({ clip, index }) => {
              expect(clip.id).to.equal(2)
              expect(clip.base64).to.equal('')
              expect(index).to.equal(1)
            }
          }
        ]
      })
    })
  })
  describe('DELETE_CLIP', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.DELETE_CLIP],
        payload: 1,
        mutations: [
          {
            type: types.m.REMOVE_CLIP,
            test: id => {
              expect(id).to.equal(1)
            }
          }
        ]
      })
    })
  })
  describe('DELETE_ALL_CLIP', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.DELETE_ALL_CLIP],
        mutations: [
          {
            type: types.m.REMOVE_ALL_CLIP
          }
        ]
      })
    })
  })
  describe('SELECT_CLIP', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.SELECT_CLIP],
        payload: 1,
        mutations: [
          {
            type: types.m.SELECT_CLIP,
            test: id => {
              expect(id).to.equal(1)
            }
          }
        ]
      })
    })
  })
  describe('SWAP_CLIP_ORDER', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.SWAP_CLIP_ORDER],
        payload: { from: 1, to: 10 },
        mutations: [
          {
            type: types.m.SWAP_CLIP_ORDER,
            test: ({ from, to }) => {
              expect(from).to.equal(1)
              expect(to).to.equal(10)
            }
          }
        ]
      })
    })
  })
  describe('UPDATE_DELAY', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.UPDATE_DELAY],
        payload: { id: 1, delay: 10 },
        mutations: [
          {
            type: types.m.UPDATE_DELAY,
            test: ({ id, delay }) => {
              expect(id).to.equal(1)
              expect(delay).to.equal(10)
            }
          }
        ]
      })
    })
  })
  describe('CLONE_CLIP', () => {
    it('base64 width height が継承されたクリップが追加されること', done => {
      const state = {
        clipList: [
          { id: 1, base64: 'a', width: 1, height: 2 },
          { id: 2, base64: 'b', width: 10, height: 20 }
        ]
      }
      testAction({
        done,
        action: actions[types.a.CLONE_CLIP],
        state,
        payload: { id: 1, index: 0 },
        mutations: [
          {
            type: types.m.ADD_CLIP,
            test: ({ clip, index }) => {
              expect(clip.id).not.to.equal(1)
              expect(clip.base64).to.equal('a')
              expect(clip.width).to.equal(1)
              expect(clip.height).to.equal(2)
              expect(index).to.equal(0)
            }
          }
        ]
      })
    })
    it('index を省略すると、複製対象の直後に挿入されること', done => {
      const state = {
        clipList: [
          { id: 1, base64: 'a', width: 1, height: 2 },
          { id: 2, base64: 'b', width: 10, height: 20 }
        ]
      }
      testAction({
        done,
        action: actions[types.a.CLONE_CLIP],
        state,
        payload: { id: 1 },
        mutations: [
          {
            type: types.m.ADD_CLIP,
            test: ({ clip, index }) => {
              expect(clip.id).not.to.equal(1)
              expect(clip.base64).to.equal('a')
              expect(clip.width).to.equal(1)
              expect(clip.height).to.equal(2)
              expect(index).to.equal(1)
            }
          }
        ]
      })
    })
  })
  describe('CREATE_SVG_ELEMENT', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.CREATE_SVG_ELEMENT],
        payload: { clipId: 1, svgElement: 'abc' },
        mutations: [
          {
            type: types.m.ADD_SVG_ELEMENT,
            test: ({ clipId, svgElement }) => {
              expect(clipId).to.equal(1)
              expect(svgElement).to.equal('abc')
            }
          }
        ]
      })
    })
  })
  describe('UPDATE_SVG_ELEMENT', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.UPDATE_SVG_ELEMENT],
        payload: { clipId: 1, svgElement: 'abc', svgElementList: 'bbb' },
        mutations: [
          {
            type: types.m.UPDATE_SVG_ELEMENT,
            test: ({ clipId, svgElement, svgElementList }) => {
              expect(clipId).to.equal(1)
              expect(svgElement).to.equal('abc')
              expect(svgElementList).to.equal('bbb')
            }
          }
        ]
      })
    })
  })
  describe('DELETE_SVG_ELEMENT', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.DELETE_SVG_ELEMENT],
        payload: { clipId: 1, svgElementId: 'abc', svgElementIdList: 'bbb' },
        mutations: [
          {
            type: types.m.REMOVE_SVG_ELEMENT,
            test: ({ clipId, svgElementId, svgElementIdList }) => {
              expect(clipId).to.equal(1)
              expect(svgElementId).to.equal('abc')
              expect(svgElementIdList).to.equal('bbb')
            }
          }
        ]
      })
    })
  })
  describe('UNDO_SVG_ELEMENT', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.UNDO_SVG_ELEMENT],
        payload: { clipId: 1 },
        mutations: [
          {
            type: types.m.UNDO_SVG_ELEMENT,
            test: ({ clipId }) => {
              expect(clipId).to.equal(1)
            }
          }
        ]
      })
    })
  })
  describe('REDO_SVG_ELEMENT', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.REDO_SVG_ELEMENT],
        payload: { clipId: 1 },
        mutations: [
          {
            type: types.m.REDO_SVG_ELEMENT,
            test: ({ clipId }) => {
              expect(clipId).to.equal(1)
            }
          }
        ]
      })
    })
  })
  describe('JUMP_SVG_ELEMENT_HISTORY', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.JUMP_SVG_ELEMENT_HISTORY],
        payload: { clipId: 1, to: 2 },
        mutations: [
          {
            type: types.m.JUMP_SVG_ELEMENT_HISTORY,
            test: ({ clipId, to }) => {
              expect(clipId).to.equal(1)
              expect(to).to.equal(2)
            }
          }
        ]
      })
    })
  })
  describe('CLEAR_SVG_ELEMENT_HISTORY', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.CLEAR_SVG_ELEMENT_HISTORY],
        payload: { clipId: 1 },
        mutations: [
          {
            type: types.m.CLEAR_SVG_ELEMENT_HISTORY,
            test: ({ clipId }) => {
              expect(clipId).to.equal(1)
            }
          }
        ]
      })
    })
  })
  describe('IMPORT_STATE', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.IMPORT_STATE],
        payload: 1,
        mutations: [
          {
            type: types.m.IMPORT_STATE,
            test: state => {
              expect(state).to.equal(1)
            }
          }
        ]
      })
    })
  })
  describe('CREATE_LAYER', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.CREATE_LAYER],
        payload: { layer: { id: 2 }, index: 1 },
        mutations: [
          {
            type: types.m.ADD_LAYER,
            test: ({ layer, index }) => {
              expect(layer.id).to.equal(2)
              expect(layer.from).to.equal(0)
              expect(index).to.equal(1)
            }
          }
        ]
      })
    })
  })
  describe('DELETE_LAYER', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.DELETE_LAYER],
        payload: 1,
        mutations: [
          {
            type: types.m.REMOVE_LAYER,
            test: id => {
              expect(id).to.equal(1)
            }
          }
        ]
      })
    })
  })
  describe('SWAP_LAYER_ORDER', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.SWAP_LAYER_ORDER],
        payload: { from: 1, to: 10 },
        mutations: [
          {
            type: types.m.SWAP_LAYER_ORDER,
            test: ({ from, to }) => {
              expect(from).to.equal(1)
              expect(to).to.equal(10)
            }
          }
        ]
      })
    })
  })
  describe('CLONE_LAYER', () => {
    it('from to が継承されたクリップが追加されること', done => {
      const state = {
        layerList: [{ id: 1, from: 10, to: 100 }, { id: 2, from: 20, to: 200 }]
      }
      testAction({
        done,
        action: actions[types.a.CLONE_LAYER],
        state,
        payload: { id: 1, index: 0 },
        mutations: [
          {
            type: types.m.ADD_LAYER,
            test: ({ layer, index }) => {
              expect(layer.id).not.to.equal(1)
              expect(layer.from).to.equal(10)
              expect(layer.to).to.equal(100)
              expect(index).to.equal(0)
            }
          }
        ]
      })
    })
    it('index を省略すると、複製対象の直後に挿入されること', done => {
      const state = {
        layerList: [{ id: 1, from: 10, to: 100 }, { id: 2, from: 20, to: 200 }]
      }
      testAction({
        done,
        action: actions[types.a.CLONE_LAYER],
        state,
        payload: { id: 1 },
        mutations: [
          {
            type: types.m.ADD_LAYER,
            test: ({ layer, index }) => {
              expect(layer.id).not.to.equal(1)
              expect(layer.from).to.equal(10)
              expect(layer.to).to.equal(100)
              expect(index).to.equal(1)
            }
          }
        ]
      })
    })
  })
  describe('SELECT_LAYER', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.SELECT_LAYER],
        payload: 1,
        mutations: [
          {
            type: types.m.SELECT_LAYER,
            test: id => {
              expect(id).to.equal(1)
            }
          }
        ]
      })
    })
  })
  describe('UPDATE_LAYER_RANGE', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.UPDATE_LAYER_RANGE],
        payload: { id: 1, from: 2, to: 3 },
        mutations: [
          {
            type: types.m.UPDATE_LAYER_RANGE,
            test: ({ id, from, to }) => {
              expect(id).to.equal(1)
              expect(from).to.equal(2)
              expect(to).to.equal(3)
            }
          }
        ]
      })
    })
  })
  describe('SET_CURRENT_TIME', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.SET_CURRENT_TIME],
        payload: 1,
        mutations: [
          {
            type: types.m.SET_CURRENT_TIME,
            test: currentTime => {
              expect(currentTime).to.equal(1)
            }
          }
        ]
      })
    })
  })
  describe('SET_EDIT_TARGET_TYPE', () => {
    it('mutationが正しく実行されること', done => {
      testAction({
        done,
        action: actions[types.a.SET_EDIT_TARGET_TYPE],
        payload: 'clip',
        mutations: [
          {
            type: types.m.SET_EDIT_TARGET_TYPE,
            test: type => {
              expect(type).to.equal('clip')
            }
          }
        ]
      })
    })
  })
})
