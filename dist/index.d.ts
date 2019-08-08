import { TwtMenu } from './lib/menu';
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
    constructor(option: IOption);
    private _checkValid;
    /** 获取用户的AccessTooken */
    getAcToken: () => Promise<ICommonResult<IAcTokenResultSucc>>;
}
export {};
//# sourceMappingURL=index.d.ts.map