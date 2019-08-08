import { TwtMenu } from './lib/menu';
import { TwtWeb } from './lib/web';
interface IOption {
    appId: string;
    appSecret: string;
    accessToken?: string;
    accessExpire?: number;
}
interface IAcTokenResultSucc {
    access_token?: string;
    expires_in?: number;
}
export interface ICommonResultErr {
    errcode: number;
    errmsg: string;
}
export interface ICommonResult<T> {
    msg: string;
    code?: number;
    data?: T | null;
}
export declare class TmtWechat {
    readonly appId: string;
    readonly appSecret: string;
    private accessToken;
    private accessExpire;
    static menu: TwtMenu;
    static web: TwtWeb;
    constructor(option: IOption);
    private _checkValid;
    /** 获取用户的AccessTooken */
    getAcToken: () => Promise<ICommonResult<IAcTokenResultSucc>>;
}
export {};
//# sourceMappingURL=index.d.ts.map