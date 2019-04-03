import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();

//新增字典
api.post('/addDic', async(req,res) =>{
  res.send(await fetchJsonByNode(req, `${host}/dictionary-service/dictionary/service/tenant/insert`,postOption(req.body)))
});


export default api;
