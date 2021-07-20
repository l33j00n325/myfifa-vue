import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async create (_, { matchId, attributes }) {
    const query = gql`
      mutation createGoal($matchId: ID!, $attributes: GoalAttributes!) {
        addGoal(matchId: $matchId, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { addGoal: { errors } } =
      await this.$graphql.default.request(query, { matchId, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: GoalAttributes!) {
        updateGoal(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updateGoal: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeGoal($id: ID!) {
        removeGoal(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeGoal: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Goal').delete(id)
    }
  }
}
