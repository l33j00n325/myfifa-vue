import http from '@/api'
import myfifa from '@/api/myfifa'
import objectify from '@/plugins/objectify'

// actions
export const actions = {
  getAll ({ commit, rootState }, { playerId }) {
    return http({
      path: myfifa.loans.index,
      pathData: { playerId },
      token: rootState.token,
      success: ({ data }) => {
        commit('player/SET', {
          ...rootState.player.list[playerId],
          loans: objectify(data)
        }, { root: true })
      }
    })
  },
  create ({ commit, rootState }, { playerId, loan }) {
    return http({
      method: 'post',
      path: myfifa.loans.index,
      pathData: { playerId },
      token: rootState.token,
      data: { loan }
    })
  },
  update ({ commit, rootState }, loan) {
    return http({
      method: 'patch',
      path: myfifa.loans.record,
      pathData: { loanId: loan.id },
      token: rootState.token,
      data: { loan }
    })
  }
}
