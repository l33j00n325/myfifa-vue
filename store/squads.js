import { gql } from 'nuxt-graphql-request'
import { squadFragment } from '@/fragments'

// actions
export const actions = {
  async create (_, { teamId, attributes }) {
    const query = gql`
      mutation createSquad($teamId: ID!, $attributes: SquadAttributes!) {
        addSquad(teamId: $teamId, attributes: $attributes) {
          squad { ...SquadData }
          errors { fullMessages }
        }
      }
      ${squadFragment}
    `

    const { addSquad: { squad, errors } } =
      await this.$graphql.default.request(query, { teamId, attributes })

    if (squad) {
      this.$db().model('Squad').insertOrUpdate({ data: squad })
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: SquadAttributes!) {
        updateSquad(id: $id, attributes: $attributes) {
          squad { ...SquadData }
          errors { fullMessages }
        }
      }
      ${squadFragment}
    `

    const { updateSquad: { squad, errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (squad) {
      this.$db().model('Squad').insertOrUpdate({ data: squad })
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeSquad($id: ID!) {
        removeSquad(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeSquad: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Squad').delete(id)
    }
  },
  async storeLineup (_, { matchId, squadId }) {
    const query = gql`
      mutation storeMatchLineupToSquad($matchId: ID!, $squadId: ID!) {
        storeMatchLineupToSquad(matchId: $matchId, squadId: $squadId) {
          squad { id }
        }
      }
    `

    const { storeMatchLineupToSquad: { squad } } =
      await this.$graphql.default.request(query, { matchId, squadId })

    if (squad) {
      this.$db().model('SquadPlayer').delete(
        squadPlayer => squadPlayer.squadId === squadId
      )
    }
  }
}
