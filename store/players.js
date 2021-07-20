import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async create (_, { teamId, attributes }) {
    const query = gql`
      mutation createPlayer($teamId: ID!, $attributes: PlayerAttributes!) {
        addPlayer(teamId: $teamId, attributes: $attributes) {
          player { id }
          errors { fullMessages }
        }
      }
    `

    const { addPlayer: { errors, player } } =
      await this.$graphql.default.request(query, { teamId, attributes })

    if (player) {
      this.$db().model('Player').insert({ data: player })
      return player
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: PlayerAttributes!) {
        updatePlayer(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updatePlayer: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removePlayer($id: ID!) {
        removePlayer(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removePlayer: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Player').delete(id)
    }
  },
  async retire (_, id) {
    const query = gql`
      mutation retirePlayer($id: ID!) {
        retirePlayer(id: $id) {
          player { id }
        }
      }
    `

    const { retirePlayer: { player } } =
      await this.$graphql.default.request(query, { id })

    if (!player) {
      throw new Error('Could not retire Player')
    }
  },
  async release (_, id) {
    const query = gql`
      mutation releasePlayer($id: ID!) {
        releasePlayer(id: $id) {
          player { id }
        }
      }
    `

    const { releasePlayer: { player } } =
      await this.$graphql.default.request(query, { id })

    if (!player) {
      throw new Error('Could not release Player')
    }
  }
}
