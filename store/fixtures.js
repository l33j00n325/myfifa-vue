import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async create (_, { stageId, attributes }) {
    const query = gql`
      mutation createFixture($stageId: ID!, $attributes: FixtureAttributes!) {
        addFixture(stageId: $stageId, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { addFixture: { errors } } =
      await this.$graphql.default.request(query, { stageId, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: FixtureAttributes!) {
        updateFixture(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updateFixture: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeFixture($id: ID!) {
        removeFixture(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeFixture: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Fixture').delete(id)
    }
  }
}
