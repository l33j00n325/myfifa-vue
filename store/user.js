export const actions = {
  async get ({ commit }) {
    const data = await this.$axios.$get('user')
    commit('setUser', data, { root: true })
  },
  async create ({ commit }, user) {
    await this.$axios.$post('user', { user })
    commit('broadcaster/announce', {
      message: 'Account has been registered!',
      color: 'success'
    }, { root: true })
  },
  async changePassword (_, user) {
    await this.$axios.$patch('user/password', { user })
  },
  async update ({ commit }, user) {
    const data = await this.$axios.$patch('user', { user })
    commit('setUser', data, { root: true })
  },
  async setDarkMode ({ commit }, darkModeOn) {
    await this.$axios.$patch('user', { user: { dark_mode: darkModeOn } })
    commit('setUser', { dark_mode: darkModeOn }, { root: true })
  }
}
