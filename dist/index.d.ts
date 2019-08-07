interface IOption {
    appId: string;
    appSecret: string;
}
export declare class TmtWechat {
    readonly appId: string;
    readonly appSecret: string;
    constructor(option: IOption);
    getAcToken: () => Promise<unknown>;
}
export {};
//# sourceMappingURL=index.d.ts.map