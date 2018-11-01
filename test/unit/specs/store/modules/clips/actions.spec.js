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
