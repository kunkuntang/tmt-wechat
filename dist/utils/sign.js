"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsSHA = require('jssha');
/** 生成随机字符串 */
const createNonceStr = function () {
    return Math.random().toString(36).substr(2, 15);
};
/** 生成时间戳 */
const createTimestampStr = function () {
    return parseInt((new Date().getTime() / 1000).toString()).toString();
};
/**
 * 获取排序后拼接的字符串
 * 对所有待签名参数按照字段名排序拼接，签名生成规则如下：
 * 参与签名的字段包括noncestr（随机字符串）,
 * 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分）。
 * 对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，
 * 使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。
 * 这里需要注意的是所有参数名均为小写字符。对string1作sha1加密，
 * 字段名和字段值都采用原始值，不进行URL 转义。
*/
const getSortSignParamsStr = function (args) {
    // 去掉url里#及其后面部分
    const url = args.url.split('#')[0];
    args.url = url;
    // js中可能会传入大小写不一致的参数，先处理成小写再排序
    let keys = Object.keys(args);
    const newArgs = {
        nonceStr: '',
        jsapi_ticket: '',
        timestamp: 0,
        url: '',
    };
    let newKeys = [];
    keys.forEach(function (key) {
        let newKey = key.toLowerCase();
        newKeys.push(newKey);
        // @ts-ignore
        newArgs[newKey] = args[key];
    });
    // 按照ASCII 码从小到大排序
    newKeys = newKeys.sort();
    // 拼接字符串
    let string = '';
    newKeys.forEach(k => {
        string += '&' + k + '=' + newArgs[k];
    });
    // 去除url一开始拼接的‘&’符号
    string = string.substr(1);
    return string;
};
/**
 * @synopsis 签名算法
 *
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
 *
 * @returns
 */
exports.generateSignConfig = function (params) {
    const jsapi_ticket = params.jsapi_ticket;
    const url = params.url;
    const config = {
        nonceStr: createNonceStr(),
        timestamp: createTimestampStr(),
        jsapi_ticket,
        url,
    };
    const string = getSortSignParamsStr(config);
    const shaObj = new jsSHA('SHA-1', 'TEXT');
    shaObj.update(string);
    const signature = shaObj.getHash('HEX');
    return Object.assign({}, config, { signature });
};
