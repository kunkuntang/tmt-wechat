import { TmtWechat } from "../src";
import { MenuBtnTypeEnum } from '../src/lib/menu'

const twt = new TmtWechat({
  appId: 'wx7eb04cc84eb21896',
  appSecret: '784eed575b3236518ba332fb8226a448'
});

twt.getAcToken().then(res => {
  console.log('res', res)
})
