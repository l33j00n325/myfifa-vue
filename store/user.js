// actions
export const actions = {
  async get ({ commit }) {
    const data = await this.$axios.$get('user')
    this.$db().model('User').insert({ data })
    commit('setUserId', data.id, { root: true })
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
  async update (_, user) {
    const data = await this.$axios.$patch('user', { user })
    this.$db().model('User').insert({ data })
  },
  async setDarkMode (_, darkModeOn) {
    const data = await this.$axios.$patch('user', {
      user: { dark_mode: darkModeOn }
    })
    this.$db().model('User').insert({ data })
  }
}
