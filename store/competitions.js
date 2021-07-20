import { gql } from 'nuxt-graphql-request'
import { competitionFragment } from '@/fragments'

// actions
export const actions = {
  async fetch (_, { teamId, query }) {
    query = query || gql`
      query fetchCompetitions($teamId: ID!) {
        team(id: $teamId) {
          competitions { ...CompetitionData }
        }
      }
      ${competitionFragment}
    `

    const { team: { competitions } } =
      await this.$graphql.default.request(query, { teamId })
    this.$db().model('Competition').insertOrUpdate({ data: competitions })
  },
  async create (_, { teamId, attributes }) {
    const query = gql`
      mutation createCompetition($teamId: ID!, $attributes: CompetitionAttributes!) {
        addCompetition(teamId: $teamId, attributes: $attributes) {
          competition { id }
          errors { fullMessages }
        }
      }
    `

    const { addCompetition: { errors, competition } } =
      await this.$graphql.default.request(query, { teamId, attributes })

    if (competition) {
      this.$db().model('Competition').insert({ data: competition })
      return competition
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: CompetitionAttributes!) {
        updateCompetition(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updateCompetition: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeCompetition($id: ID!) {
        removeCompetition(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeCompetition: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Competition').delete(id)
    }
  }
}
