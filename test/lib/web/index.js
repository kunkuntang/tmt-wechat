const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const TmtWechat = require('../../../');
const fs = require('fs');
const path = require('path');

let indexHtml = fs.readFileSync(path.join(__dirname, './index.html'), 'utf-8');

const app = new Koa();
const router = new Router();

const twt = new TmtWechat({
  appId: 'wx7eb04cc84eb21896',
  appSecret: '784eed575b3236518ba332fb8226a448'
})

const twtWeb = TmtWechat.web

router.get('/', (ctx, next) => {
  ctx.body = indexHtml;
})

router.get('/getAuthAcToken', async(ctx, next) => {
  // ctx.router available
  console.log('ctx query', ctx.query)
  const code = ctx.query['code']
  const res = await twtWeb.getAuthAcToken(code)
  console.log('getAuthAcToken res', res)
  ctx.body = res;
});

router.get('/getUserInfo', async(ctx, next) => {
  // ctx.router available
  console.log('ctx query', ctx.query)
  const code = ctx.query['code']
  let res = await twtWeb.getAuthAcToken(code)
  if (res.code === 0) {
    res = await twtWeb.getWxUserInfo()
  }
  console.log('getUserInfo res', res)
  ctx.body = res;
});

router.post('/getJsSDKConfig', koaBody(), async(ctx, next) => {
  console.log('ctx body', ctx.request.body);
  const url = ctx.request.body['url'];
  let acTokenRes = await twt.getAcToken()
  console.log('acTokenRes', acTokenRes)
  let res = await twtWeb.getJsSDKConfig({
    url
  })
  console.log('getJsSDKConfig res', res)
  ctx.body = res;
})

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(80, () => {
  console.log('server is listening 80');
})