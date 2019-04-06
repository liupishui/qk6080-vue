export default {
  state: { token: '' },
  mutations: {
    set_token (state, token) {
      state.token = token
      sessionStorage.setItem('token', token)
    },
    del_token (state) {
      state.token = ''
      sessionStorage.removeItem('token')
    }
  },
  actions: {},
  getters: {}
}
