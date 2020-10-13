/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 * apiPrefix: api前缀
 */
let baseUrl = ''
let baseImgPath = ''
let apiPrefix = 'cwxt-base-cms'

if (process.env.NODE_ENV === 'development') {
  // apiPrefix = "ck-api_shpm-cms";
} else {
  apiPrefix = 'cwxt-base-cms'
}
export { baseUrl, baseImgPath, apiPrefix }
