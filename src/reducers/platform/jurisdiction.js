import {combineReducers} from 'redux';
import {combineReducers as combineReducers2} from '../../action-reducer/combine';
import {createReducer} from '../../action-reducer/reducer';

const create = (key) => {
  const prefix = ['platform', 'jurisdiction', key];
  const edit = combineReducers2({edit: createReducer(prefix.concat('edit'))});
  return createReducer(prefix, edit);
};

const reducer = combineReducers({
  dataRule: create('dataRule'),
  dataType: create('dataType'),
  tenantRuleTypes: create('tenantRuleTypes'),
});

export default reducer;
