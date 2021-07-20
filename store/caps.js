import { gql } from 'nuxt-graphql-request'
import { capFragment } from '@/fragments'

// actions
export const actions = {
  async create (_, { matchId, attributes }) {
    const query = gql`
      mutation createCap($matchId: ID!, $attributes: CapAttributes!) {
        addCap(matchId: $matchId, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { addCap: { errors } } =
      await this.$graphql.default.request(query, { matchId, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: CapAttributes!) {
        updateCap(id: $id, attributes: $attributes) {
          cap { ...CapData }
          errors { fullMessages }
        }
      }
      ${capFragment}
    `

    const { updateCap: { cap, errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (cap) {
      this.$db().model('Cap').insertOrUpdate({ data: cap })
    } else {
      throw new Error(errors.fullMessages[0])
    }
  }
}
