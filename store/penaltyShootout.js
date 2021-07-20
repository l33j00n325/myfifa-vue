import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async save (_, { matchId, attributes }) {
    const query = gql`
      mutation savePenaltyShootout($matchId: ID!, $attributes: PenaltyShootoutAttributes!) {
        updateMatch(id: $matchId, attributes: { penaltyShootoutAttributes: $attributes }) {
          errors { fullMessages }
        }
      }
    `

    const { updateMatch: { errors } } =
      await this.$graphql.default.request(query, { matchId, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removePenaltyShootout($id: ID!) {
        removePenaltyShootout(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removePenaltyShootout: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('PenaltyShootout').delete(id)
    }
  }
}
