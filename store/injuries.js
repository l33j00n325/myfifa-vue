import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async create (_, { playerId, attributes }) {
    const query = gql`
      mutation createInjury($playerId: ID!, $attributes: InjuryAttributes!) {
        addInjury(playerId: $playerId, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { addInjury: { errors } } =
      await this.$graphql.default.request(query, { playerId, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: InjuryAttributes!) {
        updateInjury(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updateInjury: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeInjury($id: ID!) {
        removeInjury(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeInjury: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Injury').delete(id)
    }
  }
}
