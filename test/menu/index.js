const TmtWechat = require('../../')

const twt = new TmtWechat({
  appId: 'wx7eb04cc84eb21896',
  appSecret: '784eed575b3236518ba332fb8226a448'
});

twt.getAcToken().then(res => {
  console.log('getAcToken result: ', res)
  TmtWechat.menu.createMenu({
    button: [{
      name: '测试子菜单1',
      sub_button: [{
        name: '子菜单1',
        key: 'subMenu1',
        type: 'click'
      }, {
        name: 'baidu',
        type: 'view',
        url: 'https://www.baidu.com/'
      }]
    }, {
      name: '测试子菜单2',
      type: 'view',
      url: 'https://www.jd.com/'
    }]
  }).then(res => {
    console.log('createMenu result: ', res)
  })
})

// TmtWechat.menu.createMenu({
//   button: [{
//     name: '测试子菜单1',
//     sub_button: [{
//       name: '子菜单1',
//       key: 'subMenu1',
//       type: 'click'
//     }, {
//       name: 'baidu',
//       type: 'view',
//       url: 'https://www.baidu.com/'
//     }]
//   }, {
//     name: '测试子菜单2',
//     type: 'view',
//     url: 'https://www.jd.com/'
//   }]
// }).then(res => {
//   console.log('createMenu result: ', res)
// })