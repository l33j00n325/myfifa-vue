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
      commit('setRecord', data)
    }
  },
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
  async remove ({ commit }, id) {
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
      commit('removeRecord', id)
    }
  }
}
