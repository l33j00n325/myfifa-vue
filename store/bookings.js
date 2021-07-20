import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async create (_, { matchId, attributes }) {
    const query = gql`
      mutation createBooking($matchId: ID!, $attributes: BookingAttributes!) {
        addBooking(matchId: $matchId, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { addBooking: { errors } } =
      await this.$graphql.default.request(query, { matchId, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: BookingAttributes!) {
        updateBooking(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updateBooking: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeBooking($id: ID!) {
        removeBooking(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeBooking: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Booking').delete(id)
    }
  }
}
