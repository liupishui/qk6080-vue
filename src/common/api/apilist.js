/*
 * @Author: liups
 * @Date:   2019-03-29 10:49:03
 * @Last Modified by:   liups
 * @Last Modified time: 2019-03-29 10:49:08
 */

'use strict'
const apilist = [{
  name: 'list.php', // 必须以api/开头
  type: 'GET',
  authorization: false // 是否需要验证
}, {
  name: 'api/moduleName/functionName',
  type: 'POST',
  authorization: false
}]
export default apilist
