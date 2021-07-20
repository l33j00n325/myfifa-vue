import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async create (_, { playerId, attributes }) {
    const query = gql`
      mutation createContract($playerId: ID!, $attributes: ContractAttributes!) {
        addContract(playerId: $playerId, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { addContract: { errors } } =
      await this.$graphql.default.request(query, { playerId, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: ContractAttributes!) {
        updateContract(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updateContract: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeContract($id: ID!) {
        removeContract(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeContract: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Contract').delete(id)
    }
  }
}
