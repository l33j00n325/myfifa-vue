import { gql } from 'nuxt-graphql-request'
import { capFragment } from '@/fragments'

// state
export const state = () => ({
  teamOptions: []
})

// mutations
export const mutations = {
  setTeamOptions (state, teamOptions) {
    state.teamOptions = teamOptions
  }
}

// actions
export const actions = {
  async create (_, { teamId, attributes }) {
    const query = gql`
      mutation createMatch($teamId: ID!, $attributes: MatchAttributes!) {
        addMatch(teamId: $teamId, attributes: $attributes) {
          match { id }
          errors { fullMessages }
        }
      }
    `

    const { addMatch: { errors, match } } =
      await this.$graphql.default.request(query, { teamId, attributes })

    if (match) {
      this.$db().model('Match').insert({ data: match })
      return match
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: MatchAttributes!) {
        updateMatch(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updateMatch: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeMatch($id: ID!) {
        removeMatch(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeMatch: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Match').delete(id)
    }
  },
  async applySquad (_, { matchId, squadId }) {
    const query = gql`
      mutation applySquadToMatch($matchId: ID!, $squadId: ID!) {
        applySquadToMatch(matchId: $matchId, squadId: $squadId) {
          match {
            id
            caps { ...CapData }
          }
        }
      }
      ${capFragment}
    `

    const { applySquadToMatch: { match } } =
      await this.$graphql.default.request(query, { matchId, squadId })

    if (match) {
      this.$db().model('Match').insertOrUpdate({ data: match })
    }
  },
  async fetchTeamOptions ({ commit }, { teamId }) {
    const query = gql`
      query fetchTeam($id: ID!) {
        team(id: $id) {
          opponents
        }
      }
    `

    const { team: { opponents } } =
      await this.$graphql.default.request(query, { id: teamId })

    commit('setTeamOptions', opponents)
  }
}
