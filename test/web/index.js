const Koa = require('koa');
const app = new Koa();
const TmtWechat = require('../../');

const tmtWct = new TmtWechat({
  appId: 'wx7eb04cc84eb21896',
  appSecret: '784eed575b3236518ba332fb8226a448'
})

app.listen(8080, () => {
  console.log('server is listening 8080');
})