/**
 * 这是一个关于微信网页相关的SDK
 * @Author: kuntang@163.com
 * @Date: 2019-08-08 01:33:17 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-08-08 22:24:29
 */

import { get } from "src/utils/http";
import { ICommonResultErr, ICommonResult } from "src";

interface IOption {
  appId: string;
  appSecret: string;
}

interface IAuthAcTokenResultSucc {
  /** 网页授权接口调用凭证,注意：此access_token与基础支持的access_token不同 */
  access_token: string;
  /** access_token接口调用凭证超时时间，单位（秒） */
  expires_in: number;
  /** 用户刷新access_token */
  refresh_token: string;
  /** 用户唯一标识，请注意，在未关注公众号时，用户访问公众号的网页，也会产生一个用户和公众号唯一的OpenID */
  openid: string;
  /** 用户授权的作用域，使用逗号（,）分隔 */
  scope: string;
}

interface IGetWxUserInfoParams {
  /** 网页授权接口调用凭证,注意：此access_token与基础支持的access_token不同 */
  accessToken: string;
  /** 用户的唯一标识 */
  openid: string
  /** 返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语 */
  lang: string;
}

interface IWxUserInfoResultSucc {
  /** 用户的唯一标识 */
  openid: string;
  /** 用户昵称 */
  nickname: string;
  /** 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知 */
  sex: string;
  /** 用户个人资料填写的省份 */
  province: string;
  /** 普通用户个人资料填写的城市 */
  city: string;
  /** 国家，如中国为CN */
  country: string;
  /** 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。 */
  headimgurl: string;
  /** 用户特权信息，json 数组，如微信沃卡用户为（chinaunicom） */
  privilege: string;
  /** 只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。 */
  unionid: string;
}

export class TwtWeb {
  private _appId = '';
  private _appSecret = '';
  private _authAcToken = '';
  private _authExpiresIn = 0;
  private _openid = '';
  
  constructor(options?: IOption) {
    if (options) {
      this._appId = options.appId || '';
      this._appSecret = options.appSecret || '';
    }
  }

  private _checkValid() {
    if (!this._appId) {
      new Error('appId不能为空')
      return false;
    } else if (!this._appSecret) {
      new Error('appScrect不能为空')
      return false;
    }
    return true
  }

  /** 设置Web模块的配置信息 */
  setupWebConfig(config: Partial<(IOption & { authAcToken: string; authExpiresIn: number;})>) {
    this._appId = config.appId || '';
    this._appSecret = config.appSecret || '';
    this._authAcToken = config.authAcToken || '';
    this._authExpiresIn = config.authExpiresIn || 0;
  }

  /** 通过code换取网页授权access_token */
  getAuthAcToken = (code: string): Promise<ICommonResult<IAuthAcTokenResultSucc>> => {
    return new Promise(resolve => {
      if (this._checkValid()) {
        resolve({
          msg: 'web模块配置出错',
          data: null,
          code: -9999,
        })
        return 0;
      }
      const url = `https://api.weixin.qq.com/sns/oauth2/access_token`
      get(url, {
        params: {
          appid: this._appId,
          secret: this._appSecret,
          code,
          grant_type: 'authorization_code'
        },
      }).then(res => {
        if (res.status === 200) {
          const result: IAuthAcTokenResultSucc & ICommonResultErr = res.data;
          if (result.errcode) {
            resolve({
              msg: result.errmsg,
              code: result.errcode,
              data: null,
            })
          } else {
            this._authAcToken = result.access_token;
            this._authExpiresIn = result.expires_in;
            this._openid = result.openid;
            resolve({
              msg: '获取authAccessToken成功',
              code: 0,
              data: result,
            })
          }
        } else {
          return resolve({
            msg: '网络错误',
            data: null,
            code: -9998,
          })
        }
      })
    })
  }

  /** 刷新access_token（如果需要） */
  refreshAuthAcToken = (refresh_token: string): Promise<ICommonResult<IAuthAcTokenResultSucc>> => {
    return new Promise(resolve => {
      const url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token';
      get(url, {
        params: {
          appid: this._appId,
          grant_type: 'refresh_token',
          refresh_token,
        }
      }).then(res => {
        if (res.status === 200) {
          const result: IAuthAcTokenResultSucc & ICommonResultErr = res.data;
          if (result.errcode) {

          }
        }
      })
    })
  }

  /** 拉取用户信息(需scope为 snsapi_userinfo) */
  getWxUserInfo = (params?: Partial<IGetWxUserInfoParams>): Promise<ICommonResult<IWxUserInfoResultSucc>> => {
    return new Promise(resolve => {
      const url = 'https://api.weixin.qq.com/sns/userinfo'
      let access_token = this._authAcToken;
      let openid = this._openid;
      let lang = 'zh_CN';
      if (params) {
        access_token = params.accessToken ? params.accessToken : this._authAcToken;
        openid = params.openid ? params.openid : this._openid;
        lang = params.lang ? params.lang : 'zh_CN';
      }
      if (!access_token || !openid) {
        resolve({
          msg: 'web模块配置错误，请先调用Web.getAuthAcToken方法或者传入正确的配置',
          data: null,
          code: -9999,
        })
      }
      get(url, {
        params: {
          access_token,
          openid,
          lang,
        }
      }).then(res => {
        if (res.status === 200) {
          const result: IWxUserInfoResultSucc & ICommonResultErr = res.data
          if (result.errcode) {
            resolve({
              msg: result.errmsg,
              data: null,
              code: result.errcode,
            })
          } else {
            resolve({
              msg: '获取成功!',
              code: 0,
              data: {
                openid: result.openid,
                nickname: result.nickname,
                sex: result.sex,
                province: result.province,
                city: result.city,
                country: result.country,
                headimgurl: result.headimgurl,
                privilege: result.privilege,
                unionid: result.unionid,
              }
            })
          }
        } else {
          resolve({
            msg: '网络错误',
            data: null,
            code: -9998,
          })
        }
      })
    })
  }
}