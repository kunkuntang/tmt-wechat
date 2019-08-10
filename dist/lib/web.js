"use strict";
/**
 * 这是一个关于微信网页相关的SDK
 * @Author: kuntang@163.com
 * @Date: 2019-08-08 01:33:17
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-08-10 11:34:34
 */
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("../utils/http");
const sign_1 = require("../utils/sign");
class TwtWeb {
    constructor(options) {
        this._appId = '';
        this._appSecret = '';
        this._acToken = '';
        this._authAcToken = '';
        this._authExpiresIn = 0;
        this._openid = '';
        /** 通过code换取网页授权access_token */
        this.getAuthAcToken = (code) => {
            return new Promise(resolve => {
                if (!this._checkValid()) {
                    resolve({
                        msg: 'web模块配置出错',
                        data: null,
                        code: -9999,
                    });
                    return 0;
                }
                const url = `https://api.weixin.qq.com/sns/oauth2/access_token`;
                http_1.get(url, {
                    params: {
                        appid: this._appId,
                        secret: this._appSecret,
                        code,
                        grant_type: 'authorization_code'
                    },
                }).then(res => {
                    if (res.status === 200) {
                        const result = res.data;
                        if (result.errcode) {
                            resolve({
                                msg: result.errmsg,
                                code: result.errcode,
                                data: null,
                            });
                        }
                        else {
                            this._authAcToken = result.access_token;
                            this._authExpiresIn = result.expires_in;
                            this._openid = result.openid;
                            resolve({
                                msg: '获取authAccessToken成功',
                                code: 0,
                                data: result,
                            });
                        }
                    }
                    else {
                        return resolve({
                            msg: '网络错误',
                            data: null,
                            code: -9998,
                        });
                    }
                });
            });
        };
        /** 刷新access_token（如果需要） */
        this.refreshAuthAcToken = (refresh_token) => {
            return new Promise(resolve => {
                const url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token';
                http_1.get(url, {
                    params: {
                        appid: this._appId,
                        grant_type: 'refresh_token',
                        refresh_token,
                    }
                }).then(res => {
                    if (res.status === 200) {
                        const result = res.data;
                        if (result.errcode) {
                        }
                    }
                });
            });
        };
        /** 拉取用户信息(需scope为 snsapi_userinfo) */
        this.getWxUserInfo = (params) => {
            return new Promise(resolve => {
                const url = 'https://api.weixin.qq.com/sns/userinfo';
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
                    });
                }
                http_1.get(url, {
                    params: {
                        access_token,
                        openid,
                        lang,
                    }
                }).then(res => {
                    if (res.status === 200) {
                        const result = res.data;
                        if (result.errcode) {
                            resolve({
                                msg: result.errmsg,
                                data: null,
                                code: result.errcode,
                            });
                        }
                        else {
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
                            });
                        }
                    }
                    else {
                        resolve({
                            msg: '网络错误',
                            data: null,
                            code: -9998,
                        });
                    }
                });
            });
        };
        /** 获取JsSDK的配置信息 */
        this.getJsSDKConfig = (params) => {
            return new Promise(resolve => {
                let access_token = '';
                if (params) {
                    access_token = params.accessToken ? params.accessToken : this._acToken;
                }
                if (!access_token) {
                    resolve({
                        msg: 'web模块配置错误，请先调用 TmtWechat.getAcToken 方法或者传入正确的配置',
                        data: null,
                        code: -9999,
                    });
                    return 0;
                }
                const url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket';
                http_1.get(url, {
                    params: {
                        access_token,
                        type: 'jsapi'
                    }
                }).then(res => {
                    if (res.status === 200) {
                        const result = res.data;
                        if (result.errcode) {
                            resolve({
                                msg: result.errmsg,
                                code: result.errcode,
                                data: null
                            });
                        }
                        else {
                            const jsSDKConfig = sign_1.generateSignConfig({
                                url: params.url,
                                jsapi_ticket: result.ticket
                            });
                            resolve({
                                msg: '获取成功',
                                data: Object.assign({ access_token: this._acToken }, jsSDKConfig),
                                code: 0,
                            });
                        }
                    }
                    else {
                        resolve({
                            msg: '网络错误',
                            data: null,
                            code: -9998,
                        });
                    }
                });
            });
        };
        if (options) {
            this._appId = options.appId || '';
            this._appSecret = options.appSecret || '';
        }
    }
    _checkValid() {
        if (!this._appId) {
            new Error('appId不能为空');
            return false;
        }
        else if (!this._appSecret) {
            new Error('appScrect不能为空');
            return false;
        }
        return true;
    }
    /** 设置Web模块的配置信息 */
    setupWebConfig(config) {
        this._appId = config.appId || this._appId || '';
        this._appSecret = config.appSecret || this._appSecret || '';
        this._authAcToken = config.authAcToken || this._authAcToken || '';
        this._authExpiresIn = config.authExpiresIn || this._authExpiresIn || 0;
        this._acToken = config.accessToken || this._acToken || '';
    }
}
exports.TwtWeb = TwtWeb;
