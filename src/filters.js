// 过滤器规则
/** 启用停用描述
 *  @param {int} type => 1-启用  0-停用
 * */
export const getUStatusDesc = type => {
  let desc = '启用'
  switch (type) {
    case 0:
      desc = '停用'
      break
    case 1:
      desc = '启用'
      break
  }
  return `${desc}`
}

// 格式化日期部分的格式
export const formatDate = param => {
  if (typeof param !== 'string') return param
  var time = param.split(' ')[0]
  // 判断结束日期是否为长期
  if (
    time === '9999-01-01' ||
    time === '9999-01-01 00:00:00' ||
    time === '9999-01-01 00:00'
  ) {
    return '长期'
  } else {
    return time
  }
}
