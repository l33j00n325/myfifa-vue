import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async create (_, { playerId, attributes }) {
    const query = gql`
      mutation createTransfer($playerId: ID!, $attributes: TransferAttributes!) {
        addTransfer(playerId: $playerId, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { addTransfer: { errors } } =
      await this.$graphql.default.request(query, { playerId, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: TransferAttributes!) {
        updateTransfer(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updateTransfer: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeTransfer($id: ID!) {
        removeTransfer(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeTransfer: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Transfer').delete(id)
    }
  }
}
