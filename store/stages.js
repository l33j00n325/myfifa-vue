import Vue from 'vue'
import { gql } from 'nuxt-graphql-request'

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
      ['fixtures', 'tableRows'].forEach(property => {
        if (property in data) {
          dispatch(`${property}/insert`, data[property], { root: true })
          data[`${property}Ids`] = data[property].map(record => record.id)
          delete data[property]
        }
      })
      commit('setRecord', data)
    }
  },
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
  async remove ({ commit }, id) {
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
      commit('removeRecord', id)
    }
  }
}
