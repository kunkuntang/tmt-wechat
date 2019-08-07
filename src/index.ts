"use strict";
import { post, get, http } from './utils/http';

interface IOption {
    appId: string;
    appSecret: string;
}

interface IAcTokenResult {
    // 获取到的凭证
    access_token?: string;
    // 凭证有效时间，单位：秒
    expires_in?: number;
    errcode?: 1 | 0 | 4001 | 4002 | 40164;
    errmsg?: string;
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
    NOTINWHITELIST = 40164,
    _NOTINWHITELIST = '调用接口的IP地址不在白名单中，请在接口IP白名单中进行设置。（小程序及小游戏调用不要求IP地址在白名单内。）'
}

export class TmtWechat {
    readonly appId: string;
    readonly appSecret: string;
    constructor(option: IOption) {
        this.appId = option.appId || '';
        this.appSecret = option.appSecret || '';
    }

    getAcToken = () => {
        const getAcTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token';
        return new Promise(resolve => {
            get(getAcTokenUrl, {
                params: {
                    grant_type: 'client_credential',
                    appid: this.appId,
                    secret: this.appSecret,
                }
            }).then((res) => {
                if (res.status === 200) {
                    const result: IAcTokenResult = res.data;
                    console.log('get acToken result', result)
                    // @ts-ignore
                    let msg = AcTokenEnum['_' + AcTokenEnum[result.errcode]];
                    if (result.errcode === AcTokenEnum.SUCCESS) {
                        return resolve({
                            msg,
                            data: result
                        })
                    } else if (result.errcode) {
                        resolve({
                            msg,
                            code: result.errcode,
                            data: null,
                        })
                    }
                }
            })
        })
    }
}

module.exports = TmtWechat;

// Allow use of default import syntax in TypeScript
module.exports.default = TmtWechat;