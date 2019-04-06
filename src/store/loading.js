export default {
  state: { loading: false },
  mutations: {
    loading (state, extra) {
      state.loading = extra
      console.log(state.loading)
    },
    loadingStart (state) {
      state.loading = true
    },
    loadingEnd (state) {
      state.loading = false
    }
  },
  actions: {},
  getters: {}
}
