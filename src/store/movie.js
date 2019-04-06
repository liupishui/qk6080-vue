export default {
  state: {
    currentMovieId: '12',
    showplay: false,
    currentPlayTypeId: '0'
  },
  mutations: {
    loading (state, extra) {
      state.loading = extra
      console.log(state.loading)
    }
  },
  actions: {},
  getters: {}
}
