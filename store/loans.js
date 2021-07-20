import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async create (_, { playerId, attributes }) {
    const query = gql`
      mutation createLoan($playerId: ID!, $attributes: LoanAttributes!) {
        addLoan(playerId: $playerId, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { addLoan: { errors } } =
      await this.$graphql.default.request(query, { playerId, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: LoanAttributes!) {
        updateLoan(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updateLoan: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeLoan($id: ID!) {
        removeLoan(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeLoan: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Loan').delete(id)
    }
  }
}
