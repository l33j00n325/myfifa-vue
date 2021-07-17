import Vue from 'vue'
import VuexORM from '@vuex-orm/core'
import Cookie from 'js-cookie'
import * as models from '@/models'
import cookieparser from 'cookieparser'
import pkg from '@/package.json'

// initial state
export const state = () => ({
  version: pkg.version,
  token: null,
  currentUser: null
})

// getters
export const getters = {
  authenticated: state => state.token !== null
}

// mutations
export const mutations = {
  setToken (state, { token, expires }) {
    if (token) {
      expires && Cookie.set('token', token, { expires })
    } else {
      Cookie.remove('token')
    }
    state.token = token
  },
  setUser (state, user) {
    Vue.set(state, 'currentUser', {
      ...state.currentUser,
      ...user
    })
  },
  removeUser (state) {
    state.currentUser = null
  }
}

// actions
export const actions = {
  async nuxtServerInit ({ commit, dispatch }, { req, params }) {
    if (req.headers.cookie) {
      var { token } = cookieparser.parse(req.headers.cookie)

      if (token) {
        commit('setToken', { token })
        this.$graphql.default.setHeader('authorization', `Bearer ${token}`)

        try {
          await dispatch('user/get')

          // load current Team, if present
          if ('teamId' in params) {
            await dispatch('teams/get', { id: params.teamId })
          }
        } catch (e) {
          console.error(e)
          commit('setToken', { token: null })
        }
      }
    }
  },
  async login ({ commit, dispatch }, payload) {
    const data = await this.$axios.$post('oauth/token', {
      ...payload,
      client_id: this.$config.clientId,
      client_secret: this.$config.clientSecret
    })
    commit('setToken', {
      token: data.access_token,
      expires: data.expires_in / 86400
    })
    await dispatch('user/get')
    commit('broadcaster/announce', {
      message: 'You have successfully logged in!',
      color: 'success'
    }, { root: true })
  },
  async logout ({ commit, dispatch }) {
    await this.$axios.$post('oauth/revoke', {
      client_id: this.$config.clientId,
      client_secret: this.$config.clientSecret
    })
    await dispatch('orm/deleteAll')
    commit('setToken', { token: null })
    commit('removeUser')
    this.$router.push({ name: 'index' })
    commit('broadcaster/announce', {
      message: 'You have successfully logged out!',
      color: 'danger'
    }, { root: true })
  }
}

// setup VuexORM database
const database = new VuexORM.Database()
for (const key in models) {
  database.register(models[key])
}

// plugins
export const plugins = [
  VuexORM.install(database, { namespace: 'orm' })
]
