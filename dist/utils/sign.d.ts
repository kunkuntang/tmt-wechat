interface IGenerateSignConfig {
    jsapi_ticket: string;
    url: string;
}
export interface IGenerateSignConfigResult {
    timestamp: string;
    nonceStr: string;
    signature: string;
    jsapi_ticket: string;
    url: string;
}
/**
 * @synopsis 签名算法
 *
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
 *
 * @returns
 */
export declare const generateSignConfig: (params: IGenerateSignConfig) => IGenerateSignConfigResult;
export {};
//# sourceMappingURL=sign.d.ts.map