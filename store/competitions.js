import Vue from 'vue'
import { gql } from 'nuxt-graphql-request'
import { competitionFragment, stageFragment } from '@/fragments'

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
      if ('stages' in data) {
        dispatch('stages/insert', data.stages, { root: true })
        data['stagesIds'] = data.stages.map(stage => stage.id)
        delete data.stages
      }
      commit('setRecord', data)
    }
  },
  async fetch ({ dispatch }, { teamId, query }) {
    query = query || gql`
      query fetchCompetitions($teamId: ID!) {
        team(id: $teamId) {
          competitions { ...CompetitionData }
        }
      }
      ${competitionFragment}
    `

    const { team: { competitions } } =
      await this.$graphql.default.request(query, { teamId })
    dispatch('insert', competitions)
  },
  async get ({ dispatch }, id) {
    const query = gql`
      query fetchCompetition($id: ID!) {
        competition(id: $id) {
          ...CompetitionData
          stages { ...StageData }
        }
      }
      ${competitionFragment}
      ${stageFragment}
    `

    const { competition } = await this.$graphql.default.request(query, { id })
    dispatch('insert', competition)
  },
  async create ({ dispatch }, { teamId, attributes }) {
    const query = gql`
      mutation createCompetition($teamId: ID!, $attributes: CompetitionAttributes!) {
        addCompetition(teamId: $teamId, attributes: $attributes) {
          competition { id }
          errors { fullMessages }
        }
      }
    `

    const { addCompetition: { errors, competition } } =
      await this.$graphql.default.request(query, { teamId, attributes })

    if (competition) {
      dispatch('insert', competition)
      return competition
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: CompetitionAttributes!) {
        updateCompetition(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updateCompetition: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove ({ commit }, id) {
    const query = gql`
      mutation removeCompetition($id: ID!) {
        removeCompetition(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeCompetition: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      commit('removeRecord', id)
    }
  }
}
