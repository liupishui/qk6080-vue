function api(params) {
    console.log('---------', this.sliders.getAllSliders().then(rst => {
        console.log(rst)
    }))
}
export default api