export default {
  state: {
    product: [{
      name: 'apple',
      price: 20
    }]
  },
  mutations: {
    minusPrice (state, payload) {
      state.products.forEach(product => {
        product.price -= payload
      })
    }
  },
  actions: { // 添加actions
    minusPriceAsync (context, payload) {
      setTimeout(() => {
        context.commit('minusPrice', payload)
        // context提交
      }, 2000)
    }
  },
  getters: {}
}
