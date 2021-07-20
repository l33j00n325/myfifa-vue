import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async create (_, { competitionId, attributes }) {
    const query = gql`
      mutation createStage($competitionId: ID!, $attributes: StageAttributes!) {
        addStage(competitionId: $competitionId, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { addStage: { errors } } =
      await this.$graphql.default.request(query, { competitionId, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: StageAttributes!) {
        updateStage(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updateStage: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeStage($id: ID!) {
        removeStage(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeStage: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Stage').delete(id)
    }
  }
}
