import express from 'express';

let api = express.Router();

// 获取界面配置
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

export default api;
