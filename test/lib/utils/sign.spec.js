const { generateSignConfig } = require('../../../dist/utils/sign')
console.log(generateSignConfig({
  url: 'http://www.lenkuntang.cn/',
  jsapi_ticket: 'HoagFKDcsGMVCIY2vOjf9rq-PwPhEGcYhdh9Z7DDXe583j-7OQED50-zOQekci3ossZhAP-tMruSO2FZsXbcPg'
}))

generateSignConfig()