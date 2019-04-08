export default {
  state: {
    sliders: {
      manage: {
        groupname: 'manage',
        info: []
      },
      dianying: {
        groupname: 'dianying',
        info: []
      },
      dianyinglist: {
        groupname: 'dianyinglist',
        info: []
      }
    } // {groupname:'',info:[],currIndex:0}
  },
  mutations: {
    addSlider (state, slider) {
      if (typeof (state.sliders[slider.groupname]) === 'undefined') {
        state.sliders[slider.groupname] = slider
      } else {
        state.sliders[slider.groupname].info = slider.info
      }
    },
    changeinfo (state, info) {
      console.log('--------', info)
      state.sliders[info.groupname].info[info.index].show = info.show
      state.sliders[info.groupname].info[info.index].active = info.active
    }
  },
  actions: {},
  getters: {}
}

// export default {
//   state: {
//     sliders: [{
//       groupname: 'dianying',
//       info: []
//     }] // {groupname:'',info:[],currIndex:0}
//   },
//   mutations: {
//     addSlider (state, slider) {
//       let hasSlider = false
//       state.sliders.forEach(element => {
//         if (element.groupname === slider.groupname) {
//           hasSlider = true
//           element.info = slider.info
//           hasSlider = true
//         }
//       })
//       if (!hasSlider) {
//         state.sliders.push(slider)
//       }
//     }
//   },
//   actions: {},
//   getters: {}
// }
