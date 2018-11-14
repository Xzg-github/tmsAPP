import express from 'express';
import {fetchJsonByNode, postOption} from '../../common/common';
import {host} from '../globalConfig';
import name from './name';
let api = express.Router();

const currencyHandler = async (options, req) => {
  const url = `${host}/charge_service/tenant_currency_type/tenant_guid/list`;
  const json = await fetchJsonByNode(req, url);
  if (json.returnCode === 0) {
    return json.result;
  } else {
    return options;
  }
};

const queryGroupHandler = async (options) => {
  return options.length ? options : [{value: 'todo', title: '待办'}];
};

const yesOrNoHandler = async (options) => {
  if ((options.length === 2) && options[0].value === 'true_false_type_false') {
    return [options[1], options[0]];
  } else {
    return options;
  }
};

const HANDLERS = [
  {name: name.CURRENCY, handler: currencyHandler},
  {name: name.QUERY_GROUP, handler: queryGroupHandler},
  {name: name.YES_OR_NO, handler: yesOrNoHandler}
];

const handle = async (result, req, res) => {
  for (const {name, handler} of HANDLERS) {
    if (result[name]) {
      result[name] = await handler(result[name], req, res);
    }
  }
  return result;
};

api.post('/', async (req, res) => {
  const url = `${host}/dictionary_service/search/dictionary/list`;
  const json = await fetchJsonByNode(req, url, postOption(req.body.names));
  if (json.returnCode !== 0) {
    res.send(json);
  } else {
    const result = await handle(json.result, req, res);
    res.send({returnCode: 0, result});
  }
});

export default api;
