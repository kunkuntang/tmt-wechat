const TmtWechat = require('../')

const tmtWct = new TmtWechat({
  appId: 'wx7eb04cc84eb21896',
  appSecret: '784eed575b3236518ba332fb8226a448'
});

tmtWct.getAcToken().then(res => {
  console.log('res', res)
})