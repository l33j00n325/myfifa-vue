import Vue from 'vue'
import { gql } from 'nuxt-graphql-request'
import { teamFragment } from '@/fragments'

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
      ...state[record.id],
      ...record
    })
  },
  removeRecord (state, recordId) {
    Vue.delete(state.records, recordId)
  }
}

// actions
export const actions = {
  insert ({ commit, dispatch }, data) {
    if (Array.isArray(data)) {
      data.forEach(record => dispatch('insert', record))
    } else {
      // TODO: strip out competitions, matches, players, and squads
      commit('setRecord', data)
    }
  },
  async fetch ({ dispatch }) {
    const { teams } = await this.$graphql.default.request(gql`
      query fetchTeams {
        teams { ...TeamData }
      }
      ${teamFragment}
    `)
    dispatch('insert', teams)
  },
  async get ({ dispatch }, { id, query }) {
    query = query || gql`
      query fetchTeam($id: ID!) {
        team(id: $id) { ...TeamData }
      }
      ${teamFragment}
    `

    const { team } = await this.$graphql.default.request(query, { id })
    dispatch('insert', team)
  },
  async create ({ dispatch }, attributes) {
    const query = gql`
      mutation createTeam($attributes: TeamAttributes!) {
        addTeam(attributes: $attributes) {
          team { ...TeamData }
          errors { fullMessages }
        }
      }
      ${teamFragment}
    `

    const { addTeam: { errors, team } } =
      await this.$graphql.default.request(query, { attributes })

    if (team) {
      dispatch('insert', team)
      return team
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: TeamAttributes!) {
        updateTeam(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updateTeam: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove ({ commit }, teamId) {
    const query = gql`
      mutation removeTeam($id: ID!) {
        removeTeam(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeTeam: { errors } } =
      await this.$graphql.default.request(query, { id: teamId })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      commit('removeRecord', teamId)
    }
  }
}
