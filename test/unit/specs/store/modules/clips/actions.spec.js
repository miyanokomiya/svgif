import types from '@main/store/modules/clips/types'
import actions from '@main/store/modules/clips/actions'

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
        ],
        selectedId: -1
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
  })
})