"use strict";
import { post, get, http } from './utils/http';
import { TwtMenu } from './lib/menu';

interface IOption {
    appId: string;
    appSecret: string;
    accessToken?: string;
    accessExpire?: number;
}

interface IAcTokenResultSucc {
    // 获取到的凭证
    access_token?: string;
    // 凭证有效时间，单位：秒
    expires_in?: number;
}

interface IAcTokenResultErr {
    errcode?: -1 | 0 | 40001 | 40002 | 40013 | 40164;
    errmsg?: string;
}

export interface ICommonResult<T> {
    msg: string;
    code?: number;
    data?: T | null,
}

enum AcTokenEnum {
    SYSBUSY = -1,
    _SYSBUSY = '系统繁忙，此时请开发者稍候再试',
    SUCCESS = 0,
    _SUCCESS = '请求成功',
    APPSECICORRECT = 40001,
    _APPSECICORRECT = 'AppSecret错误或者AppSecret不属于这个公众号，请开发者确认AppSecret的正确性',
    GRANTTYPEERR = 40002,
    _GRANTTYPEERR = '请确保grant_type字段值为client_credential',
    INVALIDAPPID = 40013,
    _INVALIDAPPID = '非法的appId，请检查',
    NOTINWHITELIST = 40164,
    _NOTINWHITELIST = '调用接口的IP地址不在白名单中，请在接口IP白名单中进行设置。（小程序及小游戏调用不要求IP地址在白名单内。）'
}

export class TmtWechat {
    readonly appId: string;
    readonly appSecret: string;
    private accessToken = '';
    private accessExpire = 0;
    static menu = new TwtMenu();

    constructor(option: IOption) {
        this.appId = option.appId || '';
        this.appSecret = option.appSecret || '';
        this._checkValid()
    }

    private _checkValid() {
        if (!this.appId) {
            new Error('appId不能为空')
            return false;
        } else if (!this.appSecret) {
            new Error('appScrect不能为空')
            return false;
        }
        return true
    }

    /** 获取用户的AccessTooken */
    getAcToken = (): Promise<ICommonResult<IAcTokenResultSucc>> => {
        const getAcTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token';
        return new Promise(resolve => {
            if (!this._checkValid()) {
                resolve({
                    msg: 'tmtWechat配置有问题',
                    code: -9999,
                    data: null,
                })
                return 0;
            }
            get(getAcTokenUrl, {
                params: {
                    grant_type: 'client_credential',
                    appid: this.appId,
                    secret: this.appSecret,
                }
            }).then((res) => {
                if (res.status === 200) {
                    const result: IAcTokenResultSucc & IAcTokenResultErr = res.data;
                    // @ts-ignore
                    let msg = AcTokenEnum['_' + AcTokenEnum[result.errcode || 0]];
                    if (result.errcode) {
                        resolve({
                            msg,
                            code: result.errcode,
                            data: null,
                        })
                    } else if (result.access_token && result.expires_in) {
                        this.accessToken = result.access_token;
                        this.accessExpire = result.expires_in;
                        TmtWechat.menu.setMenuAccessToken(this.accessToken);
                        return resolve({
                            msg,
                            data: result,
                            code: 0,
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

}

module.exports = TmtWechat;

// Allow use of default import syntax in TypeScript
module.exports.default = TmtWechat;