import Koa = require('koa');
import Router = require('koa-router');
import TmtWechat = require('../../');

const app = new Koa();
const router = new Router();

const twt = new TmtWechat({
  appId: 'wx7eb04cc84eb21896',
  appSecret: '784eed575b3236518ba332fb8226a448'
})

const twtWeb = TmtWechat.web

router.get('/getUser', (ctx, next) => {
  // ctx.router available
  console.log('ctx query', ctx.query)
  const code = ctx.query['code']
  twtWeb.getAuthAcToken(code).then(res => {
    console.log('getAuthAcToken res', res)
  })
});

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(8080, () => {
  console.log('server is listening 8080');
})