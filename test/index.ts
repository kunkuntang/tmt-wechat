import { TmtWechat } from "src";
import { MenuBtnTypeEnum } from '../src/lib/menu'

const tmcWct = new TmtWechat({
  appId: 'wx7eb04cc84eb21896',
  appSecret: '784eed575b3236518ba332fb8226a448'
});

tmcWct.getAcToken().then(res => {
  console.log('res', res)
})

TmtWechat.menu.createMenu({
  button: [{
    name: '测试子菜单',
    type: MenuBtnTypeEnum.CLICK,
    sub_button: [{
      name: ''
    }]
  }]
})