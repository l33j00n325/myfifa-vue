import Vue from 'vue'
import { gql } from 'nuxt-graphql-request'
import { squadFragment } from '@/fragments'

export const state = () => ({
  records: {}
})

export const getters = {
  list: state => Object.values(state.records),
  get: state => id => state.records[id]
}

export const mutations = {
  setRecord (state, record) {
    Vue.set(state.records, record.id, {
      ...state.records[record.id],
      ...record
    })
  },
  removeRecord (state, recordId) {
    Vue.delete(state.records, recordId)
  }
}

export const actions = {
  insert ({ commit, dispatch }, data) {
    if (Array.isArray(data)) {
      data.forEach(record => dispatch('insert', record))
    } else {
      // TODO: strip Player from SquadPlayer
      commit('setRecord', data)
    }
  },
  async fetch ({ dispatch }, { teamId }) {
    const query = gql`
      query fetchSquads($teamId: ID!) {
        team(id: $teamId) {
          squads { ...SquadData }
        }
      }
      ${squadFragment}
    `

    const { team: { squads } } =
      await this.$graphql.default.request(query, { teamId })
    dispatch('insert', squads)
  },
  async create ({ dispatch }, { teamId, attributes }) {
    const query = gql`
      mutation createSquad($teamId: ID!, $attributes: SquadAttributes!) {
        addSquad(teamId: $teamId, attributes: $attributes) {
          squad { ...SquadData }
          errors { fullMessages }
        }
      }
      ${squadFragment}
    `

    const { addSquad: { squad, errors } } =
      await this.$graphql.default.request(query, { teamId, attributes })

    if (squad) {
      dispatch('insert', squad)
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update ({ dispatch }, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: SquadAttributes!) {
        updateSquad(id: $id, attributes: $attributes) {
          squad { ...SquadData }
          errors { fullMessages }
        }
      }
      ${squadFragment}
    `

    const { updateSquad: { squad, errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (squad) {
      dispatch('insert', squad)
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove ({ commit }, id) {
    const query = gql`
      mutation removeSquad($id: ID!) {
        removeSquad(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeSquad: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      commit('removeRecord', id)
    }
  },
  async storeLineup ({ dispatch }, { matchId, squadId }) {
    const query = gql`
      mutation storeMatchLineupToSquad($matchId: ID!, $squadId: ID!) {
        storeMatchLineupToSquad(matchId: $matchId, squadId: $squadId) {
          squad { id }
        }
      }
    `

    const { storeMatchLineupToSquad: { squad } } =
      await this.$graphql.default.request(query, { matchId, squadId })

    if (squad) {
      dispatch('insert', squad)
    }
  }
}
