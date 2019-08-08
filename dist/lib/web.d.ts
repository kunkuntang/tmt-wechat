/**
 * 这是一个关于微信网页相关的SDK
 * @Author: kuntang@163.com
 * @Date: 2019-08-08 01:33:17
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-08-08 22:19:54
 */
import { ICommonResult } from "src";
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
    openid: string;
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
export declare class TwtWeb {
    private _appId;
    private _appSecret;
    private _authAcToken;
    private _authExpiresIn;
    private _openid;
    constructor(options?: IOption);
    private _checkValid;
    /** 设置Web模块的配置信息 */
    setupWebConfig(config: Partial<(IOption & {
        authAcToken: string;
        authExpiresIn: number;
    })>): void;
    /** 通过code换取网页授权access_token */
    getAuthAcToken: (code: string) => Promise<ICommonResult<IAuthAcTokenResultSucc>>;
    /** 刷新access_token（如果需要） */
    refreshAuthAcToken: (refresh_token: string) => Promise<ICommonResult<IAuthAcTokenResultSucc>>;
    /** 拉取用户信息(需scope为 snsapi_userinfo) */
    getWxUserInfo: (params?: Partial<IGetWxUserInfoParams> | undefined) => Promise<ICommonResult<IWxUserInfoResultSucc>>;
}
export {};
//# sourceMappingURL=web.d.ts.map