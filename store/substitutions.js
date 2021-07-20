import { gql } from 'nuxt-graphql-request'
import { playerHistoryFragment } from '@/fragments'

// actions
export const actions = {
  async create (_, { matchId, attributes }) {
    const query = gql`
      mutation createSubstitution($matchId: ID!, $attributes: SubstitutionAttributes!) {
        addSubstitution(matchId: $matchId, attributes: $attributes) {
          errors { fullMessages }
          substitution {
            id
            replacement {
              id
              histories { ...PlayerHistoryData }
            }
          }
        }
      }
      ${playerHistoryFragment}
    `

    const { addSubstitution: { errors, substitution } } =
      await this.$graphql.default.request(query, { matchId, attributes })

    if (substitution) {
      this.$db().model('Substitution').insertOrUpdate({ data: substitution })
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: SubstitutionAttributes!) {
        updateSubstitution(id: $id, attributes: $attributes) {
          errors { fullMessages }
          substitution {
            id
            player {
              id
              histories { ...PlayerHistoryData }
            }
            replacement {
              id
              histories { ...PlayerHistoryData }
            }
          }
        }
      }
      ${playerHistoryFragment}
    `

    const { updateSubstitution: { errors, substitution } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (substitution) {
      this.$db().model('Substitution').insertOrUpdate({ data: substitution })
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeSubstitution($id: ID!) {
        removeSubstitution(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeSubstitution: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Substitution').delete(id)
    }
  }
}
