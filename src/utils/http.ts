import axios, { AxiosInstance } from 'axios';

const defaultOpts = {};

export const http = axios.create(defaultOpts);

export const get = http.get;

export const post = http.post;