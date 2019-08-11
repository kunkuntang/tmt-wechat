"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("./utils/http");
const menu_1 = require("./lib/menu");
const web_1 = require("./lib/web");
var AcTokenEnum;
(function (AcTokenEnum) {
    AcTokenEnum[AcTokenEnum["SYSBUSY"] = -1] = "SYSBUSY";
    AcTokenEnum["_SYSBUSY"] = "\u7CFB\u7EDF\u7E41\u5FD9\uFF0C\u6B64\u65F6\u8BF7\u5F00\u53D1\u8005\u7A0D\u5019\u518D\u8BD5";
    AcTokenEnum[AcTokenEnum["SUCCESS"] = 0] = "SUCCESS";
    AcTokenEnum["_SUCCESS"] = "\u8BF7\u6C42\u6210\u529F";
    AcTokenEnum[AcTokenEnum["APPSECICORRECT"] = 40001] = "APPSECICORRECT";
    AcTokenEnum["_APPSECICORRECT"] = "AppSecret\u9519\u8BEF\u6216\u8005AppSecret\u4E0D\u5C5E\u4E8E\u8FD9\u4E2A\u516C\u4F17\u53F7\uFF0C\u8BF7\u5F00\u53D1\u8005\u786E\u8BA4AppSecret\u7684\u6B63\u786E\u6027";
    AcTokenEnum[AcTokenEnum["GRANTTYPEERR"] = 40002] = "GRANTTYPEERR";
    AcTokenEnum["_GRANTTYPEERR"] = "\u8BF7\u786E\u4FDDgrant_type\u5B57\u6BB5\u503C\u4E3Aclient_credential";
    AcTokenEnum[AcTokenEnum["INVALIDAPPID"] = 40013] = "INVALIDAPPID";
    AcTokenEnum["_INVALIDAPPID"] = "\u975E\u6CD5\u7684appId\uFF0C\u8BF7\u68C0\u67E5";
    AcTokenEnum[AcTokenEnum["NOTINWHITELIST"] = 40164] = "NOTINWHITELIST";
    AcTokenEnum["_NOTINWHITELIST"] = "\u8C03\u7528\u63A5\u53E3\u7684IP\u5730\u5740\u4E0D\u5728\u767D\u540D\u5355\u4E2D\uFF0C\u8BF7\u5728\u63A5\u53E3IP\u767D\u540D\u5355\u4E2D\u8FDB\u884C\u8BBE\u7F6E\u3002\uFF08\u5C0F\u7A0B\u5E8F\u53CA\u5C0F\u6E38\u620F\u8C03\u7528\u4E0D\u8981\u6C42IP\u5730\u5740\u5728\u767D\u540D\u5355\u5185\u3002\uFF09";
})(AcTokenEnum || (AcTokenEnum = {}));
class TmtWechat {
    constructor(option) {
        this.accessToken = '';
        this.accessExpire = 0;
        /** 获取用户的AccessTooken */
        this.getAcToken = () => {
            const getAcTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token';
            return new Promise(resolve => {
                if (!this._checkValid()) {
                    resolve({
                        msg: 'tmtWechat配置有问题',
                        code: -9999,
                        data: null,
                    });
                    return 0;
                }
                http_1.get(getAcTokenUrl, {
                    params: {
                        grant_type: 'client_credential',
                        appid: this.appId,
                        secret: this.appSecret,
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        const result = res.data;
                        // @ts-ignore
                        let msg = AcTokenEnum['_' + AcTokenEnum[result.errcode || 0]];
                        if (result.errcode) {
                            resolve({
                                msg,
                                code: result.errcode,
                                data: null,
                            });
                        }
                        else if (result.access_token && result.expires_in) {
                            this.accessToken = result.access_token;
                            this.accessExpire = result.expires_in;
                            TmtWechat.menu.setMenuAccessToken(this.accessToken);
                            TmtWechat.web.setupWebConfig({
                                accessToken: this.accessToken
                            });
                            return resolve({
                                msg,
                                data: result,
                                code: 0,
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
        this.appId = option.appId || '';
        this.appSecret = option.appSecret || '';
        TmtWechat.web.setupWebConfig({
            appId: option.appId || '',
            appSecret: option.appSecret || '',
        });
        this._checkValid();
    }
    _checkValid() {
        if (!this.appId) {
            new Error('appId不能为空');
            return false;
        }
        else if (!this.appSecret) {
            new Error('appScrect不能为空');
            return false;
        }
        return true;
    }
    getConfig(name) {
        const twtConfig = {
            appId: this.appId,
            appSecret: this.appSecret,
            accessToken: this.accessToken,
            accessExpire: this.accessExpire
        };
        if (name) {
            return twtConfig[name] || null;
        }
        else {
            return twtConfig;
        }
    }
}
TmtWechat.menu = new menu_1.TwtMenu();
TmtWechat.web = new web_1.TwtWeb();
exports.TmtWechat = TmtWechat;
module.exports = TmtWechat;
// Allow use of default import syntax in TypeScript
module.exports.default = TmtWechat;
