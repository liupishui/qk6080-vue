let DEV_CONF = {// 开发环境配置
  j_url: 'https://www.qk6080.com/', // api baseurl
  img_url: 'https://www.qk6080.com/images/public/',
  img_url_admin: 'http://xxx.org/Api/public/static/uploads/'
}

let PRO_CONF = {// 正式环境配置
  j_url: '/', // api baseurl
  img_url: '/images/public/',
  img_url_admin: '/images/public/'
}

const APILIST = [{
  name: 'list.php', //
  type: 'GET'
}, {
  name: 'api/moduleName/functionName',
  type: 'POST',
  authorization: false// 是否需要验证
}]

export {DEV_CONF, PRO_CONF, APILIST}
