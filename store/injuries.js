import { crud, http, routes } from '@/api'
import { Injury } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Injury,
    parent: 'player',
    dataName: 'injury'
  }),
  TEAM_FETCH ({ rootState }, { teamId }) {
    return http({
      path: routes.injuries.teamIndex,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Injury.insert({ data })
      }
    })
  }
}
