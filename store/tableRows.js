import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async create (_, { stageId, attributes }) {
    const query = gql`
      mutation createTableRow($stageId: ID!, $attributes: TableRowAttributes!) {
        addTableRow(stageId: $stageId, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { addTableRow: { errors } } =
      await this.$graphql.default.request(query, { stageId, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: TableRowAttributes!) {
        updateTableRow(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updateTableRow: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeTableRow($id: ID!) {
        removeTableRow(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeTableRow: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('TableRow').delete(id)
    }
  }
}
