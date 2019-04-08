function api (params) {
  console.log('---------', this.sliders.getAllSliders().then(rst => {
    console.log(rst, 2)
  }))
}
export default api
