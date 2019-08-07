"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const defaultOpts = {};
exports.http = axios_1.default.create(defaultOpts);
exports.get = exports.http.get;
exports.post = exports.http.post;
