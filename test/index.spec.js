const TmtWechat = require('../')
const assert = require('chai').assert

const twt = new TmtWechat({
  appId: 'wx7eb04cc84eb21896',
  appSecret: '784eed575b3236518ba332fb8226a448'
});

let res = null;

before(async() => {
  res = await twt.getAcToken();
  console.log('res', res)
});


describe('twt的配置', function() {
  it('应该与初始化一致', () => {
    const config = twt.getConfig();
    assert.equal(config.appId, 'wx7eb04cc84eb21896', "[appId 一致]");
    assert.equal(config.appSecret, '784eed575b3236518ba332fb8226a448', "[appSecret 一致]");
  });
});

// describe('调用twt.getAcToken', function() {

//   it('返回的响应结构', function(done) {
//     twt.getAcToken().then(res => {
//       console.log('res', res)
//       assert.isObject(res, "[应该是一个对象]");
//       assert.equal(res.code, 0, "[里的响应状态应该为200]");
//       assert.isString(res.msg, "[里的响应提示应该是字符串]");
//       if (res.data) {
//         assert.property(res.data, 'access_token', "[应该包含access_token字段]");
//         assert.property(res.data, 'expires_in', "[应该包含expires_in字段]");
//       }
//       done();
//     }).catch((err) => {
//       done(err)
//     })
//   });
//   it('返回的响应结构里的数据', () => {});
// });

describe('调用twt.getAcToken', function() {

  it('返回的响应结构', function() {
    assert.isObject(res, "[应该是一个对象]");
    assert.equal(res.code, 0, "[里的响应状态应该为200]");
    assert.isString(res.msg, "[里的响应提示应该是字符串]");

  });

  it('返回的响应结构里的数据', () => {
    const data = res.data
    assert.property(data, 'access_token', "[应该包含access_token字段]");
    assert.property(data, 'expires_in', "[应该包含expires_in字段]");
  });

  it('twt配置一致', function() {
    const data = res.data
    assert.equal(twt.getConfig('accessToken'), data.access_token, "[accessToken 一致]");
    assert.equal(twt.getConfig('accessExpire'), data.expires_in, "[accessExpire 一致]");
  });

});