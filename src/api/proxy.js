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

// 获取经纬度两点之间的里程(注意：不是百度经纬度坐标，类似于百度墨卡坐标)
api.post('/distance', async (req, res) => {
  let {ak, points} = req.body;
  let distance = 0;
  for(let i=0; i<points.length; i+=7){
    let currentPoints = points.slice(i,i+7);
    const origin = currentPoints.pop();
    const destination = currentPoints.shift();
    const waypoints = currentPoints.join(`|`);
    const url = `http://api.map.baidu.com/directionlite/v1/driving?origin=${origin}&destination=${destination}&waypoints=${waypoints}&ak=${ak}`;
    const response = await fetch(url, {method: 'get'});
    if (response.ok) {
      const json = await response.json();
      if (json.status === 0) {
        distance += Number(json.result.routes[0].distance);
      }else {
        return res.send({returnCode: json.status, returnMsg: json.message});
      }
    } else {
      return res.send({returnCode: -1, returnMsg: '获取里程失败'});
    }
  }
  res.send({returnCode: 0, result:distance});
});

// 获取经纬度对应省市区
api.get('/district/:ak/:lat/:lng', async (req, res) => {
  const url = `http://api.map.baidu.com/geocoder/v2/?location=${req.params.lat},${req.params.lng}&output=json&ak=${req.params.ak}`;
  const response = await fetch(url, {method: 'get'});
  if (response.ok) {
    const json = await response.json();
    if (json.result && json.result.addressComponent) {
      res.send({returnCode: 0, result: json.result.addressComponent});
      return;
    }
  } else {
    console.log(response.statusText);
  }
  res.send({returnCode: -1, returnMsg: '获取省、市、区失败'});
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
