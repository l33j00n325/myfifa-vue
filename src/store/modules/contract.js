import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
const state = {
  bonusRequirementTypes: [
    'Appearances',
    'Goals',
    'Assists',
    'Clean Sheets'
  ]
}

// getters
const getters = {
}

// actions
const actions = {
  get ({ rootGetters }, { contractId }) {
    return apiRequest({
      path: myfifa.contracts.get,
      pathData: { contractId: contractId },
      token: rootGetters['user/token'],
      errorMessage: 'Failed to retrieve Contract. Please try again.'
    })
  },
  create ({ commit, rootGetters }, { playerId, contract }) {
    return apiRequest({
      method: 'post',
      path: myfifa.contracts.all,
      pathData: { playerId: playerId },
      token: rootGetters['user/token'],
      data: { contract: contract },
      success: ({ data }) => {
        commit('player/update', data, { root: true })
      },
      errorMessage: 'Failed to create Contract. Please try again.'
    })
  },
  update ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.contracts.get,
      pathData: { contractId: payload.id },
      token: rootGetters['user/token'],
      data: { contract: payload },
      success: ({ data }) => {
        commit('player/update', data, { root: true })
      },
      errorMessage: 'Failed to update Contract. Please try again.'
    })
  },
  delete ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.contracts.get,
      pathData: { contractId: payload },
      token: rootGetters['user/token'],
      success: ({ data }) => {
        commit('remove', data)
      },
      errorMessage: 'Failed to delete Contract. Please try again.'
    })
  }
}

// mutations
const mutations = {
}

export default {
  namespaced: true,

  state,
  getters,
  actions,
  mutations
}