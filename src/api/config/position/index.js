import express from 'express';

const api = express.Router();

api.get('/config', (req, res) => {
  res.send({returnCode: 0, result: require('./config').default});
});

export default api;
