import express from 'express';
import http from 'http';
import fetch from '../core/fetch';
import {hostname, port} from './globalConfig';
let api = express.Router();

const options = (req, method='get') => {
  return {
    hostname, port, method,
    path: req.url,
    headers: req.headers,
  };
};

const proxy = (res) => (response) => {
  res.writeHead(response.statusCode, response.statusMessage, response.headers);
  response.pipe(res);
};

// 获取地址对应坐标(注意：不是百度经纬度坐标，类似于百度墨卡坐标)
api.get('/:ak/:address', async (req, res) => {
  const address = encodeURIComponent(req.params.address);
  const url = `http://api.map.baidu.com/?qt=s&c=340&wd=${address}&rn=1&ie=utf-8&oue=1&fromproduct=jsapi&res=api&ak=${req.params.ak}`;
  const response = await fetch(url, {method: 'get'});
  if (response.ok) {
    const json = await response.json();
    if (json.content && json.content.length) {
      res.send({returnCode: 0, result: {x: json.content[0].x, y: json.content[0].y}});
      return;
    }
  } else {
    console.log(response.statusText);
  }
  res.send({returnCode: -1, returnMsg: '获取坐标失败'});
});

api.get('*', (req, res) => {
  http.request(options(req), proxy(res)).end();
});

api.post('*', (req, res) => {
  req.pipe(http.request(options(req, 'post'), proxy(res)));
});

api.put('*', (req, res) => {
  req.pipe(http.request(options(req, 'put'), proxy(res)));
});

export default api;
