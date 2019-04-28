// module.exports = file => require(file).default // vue-loader at least v13.0.0+
module.exports = file => require('@/pages/' + file + '.vue').default // vue-loader at least v13.0.0+
